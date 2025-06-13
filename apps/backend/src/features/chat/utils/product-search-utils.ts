import { getPrisma } from "@repo/database";
import { ChatbotSearchCriteria } from "@repo/shared";
import {
  extractCategoryFromMessage,
  findCategoryBySearchTerm,
  expandSearchQuery,
} from "./category-matcher.js";
import { assignImageUrlToProducts } from "../../../services/s3Service.js";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { PRODUCT_FULL_INCLUDE } from "@repo/database/includes/product-includes";

/**
 * Constructs a Prisma query filter for product searches
 *
 * Creates a structured query object with text search, price ranges,
 * and category filters based on the provided search criteria.
 *
 * @param criteria Search parameters including query text, price range, and categories
 * @returns Prisma-compatible where clause object for product queries
 */
export function buildWhereClause(criteria: ChatbotSearchCriteria): any {
  const whereClause: any = {};

  // Add price range conditions
  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    whereClause.price = {};

    if (criteria.minPrice !== undefined) {
      whereClause.price.gte = criteria.minPrice;
    }

    if (criteria.maxPrice !== undefined) {
      whereClause.price.lte = criteria.maxPrice;
    }
  }

  // Strategy: If we have a category match, prioritize category over text search
  // This fixes the issue where "vitamins under $30" would only find products
  // that are both in the vitamins category AND contain "vitamins" in name/description

  if (criteria.categoryId !== undefined) {
    // Category-based search: prioritize category matching
    whereClause.categoryId = criteria.categoryId;
  } else if (criteria.searchQuery) {
    // Text-based search: only when no category is identified
    const searchTerms = criteria.searchQuery
      .split(" ")
      .filter((term) => term.length > 2)
      .map((term) => term.trim());

    if (searchTerms.length > 0) {
      const orConditions: any[] = [];
      searchTerms.forEach((term) => {
        orConditions.push(
          {
            name: {
              contains: term,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: term,
              mode: "insensitive" as const,
            },
          }
        );
      });

      if (orConditions.length > 0) {
        whereClause.OR = orConditions;
      }
    }
  }

  return whereClause;
}

/**
 * Asynchronous generator for streaming product search results
 *
 * Performs an intelligent product search using natural language processing to:
 * - Expand search terms with related keywords
 * - Identify product categories from query text
 * - Apply price filters
 * - Stream matching products one by one as they're found
 *
 * @param criteria Search criteria object or search query string
 * @param minPrice Optional minimum price (used only if criteria is a string)
 * @param maxPrice Optional maximum price (used only if criteria is a string)
 * @returns AsyncGenerator that yields product objects as they're found
 */
export async function* streamProducts(
  criteria: ChatbotSearchCriteria | string,
  minPrice?: number,
  maxPrice?: number
): AsyncGenerator<any, void, unknown> {
  // Handle both string and ChatbotSearchCriteria inputs for backward compatibility
  let searchQuery: string;
  let searchMinPrice = minPrice;
  let searchMaxPrice = maxPrice;

  if (typeof criteria === "string") {
    searchQuery = criteria;
  } else {
    searchQuery = criteria.searchQuery;
    searchMinPrice = criteria.minPrice;
    searchMaxPrice = criteria.maxPrice;
  }

  // Normalize the search query
  const normalizedQuery = searchQuery.toLowerCase().trim();

  // Use the utility function to expand the search query with common variations
  const expandedQueries = expandSearchQuery(normalizedQuery);

  // Find matching category using the category matcher utility
  const matchedCategory = await findCategoryBySearchTerm(normalizedQuery);

  // Also try to extract category from the original search query
  const extractedCategory = matchedCategory
    ? null
    : await extractCategoryFromMessage(searchQuery);

  // Combine the results
  const categoryIds: number[] = [];
  if (matchedCategory) {
    categoryIds.push(matchedCategory.id);
  }

  if (extractedCategory && !categoryIds.includes(extractedCategory.id)) {
    categoryIds.push(extractedCategory.id);
  }

  // Build the where clause with expanded queries
  const whereClause: any = {};

  // Strategy: If we have a category match, prioritize category over text search
  // This fixes the issue where "vitamins under $30" would only find products
  // that are both in the vitamins category AND contain "vitamins" in name/description

  if (categoryIds.length > 0) {
    // Category-based search: prioritize category matching
    whereClause.categoryId = {
      in: categoryIds,
    };
  } else if (normalizedQuery) {
    // Text-based search: only when no category is identified
    const orConditions: any[] = [];

    expandedQueries.forEach((query) => {
      orConditions.push({
        name: {
          contains: query,
          mode: "insensitive" as const,
        },
      });

      orConditions.push({
        description: {
          contains: query,
          mode: "insensitive" as const,
        },
      });
    });

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }
  }

  // Apply price filter if specified
  if (searchMinPrice !== undefined || searchMaxPrice !== undefined) {
    // Add price filter directly to the where clause, not inside OR
    whereClause.price = {};

    if (searchMinPrice !== undefined) {
      whereClause.price.gte = searchMinPrice;
    }

    if (searchMaxPrice !== undefined) {
      whereClause.price.lte = searchMaxPrice;
    }
  }

  const prisma = await getPrisma();

  // Execute the query with full structure needed for S3 service
  const products = await prisma.product.findMany({
    where: whereClause,
    include: PRODUCT_FULL_INCLUDE,
    orderBy: {
      name: "asc",
    },
    take: 5,
  });

  let productsToStream = products;

  // Only do a price-only query if no products were found in the initial query
  // OR if we have a price-only query (no search terms)
  if (
    (products.length === 0 || whereClause.OR === undefined) &&
    (searchMinPrice !== undefined || searchMaxPrice !== undefined)
  ) {
    // Build price filter
    const priceFilter: any = {};
    if (searchMinPrice !== undefined) {
      priceFilter.gte = searchMinPrice;
    }
    if (searchMaxPrice !== undefined) {
      priceFilter.lte = searchMaxPrice;
    }

    const priceOnlyProducts = await prisma.product.findMany({
      where: {
        price: priceFilter,
      },
      include: PRODUCT_FULL_INCLUDE,
      orderBy: {
        price:
          searchMinPrice !== undefined && searchMaxPrice === undefined
            ? "desc"
            : "asc",
      },
      take: 5,
    });

    // Use the price-only products instead
    productsToStream = priceOnlyProducts;
  }

  // Use S3 service to assign proper image URLs to all products
  const productsWithImageUrls = await assignImageUrlToProducts(
    productsToStream as unknown as ProductWithImageUrl[]
  );

  // Yield each product one by one with a small delay to ensure frontend can process them
  for (const product of productsWithImageUrls) {
    yield product;

    // Small delay to ensure frontend can process each product
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
