import { getPrisma } from "@repo/database";
import { ChatbotSearchCriteria } from "../types/chatTypes.js";
import {
  extractCategoryFromMessage,
  findCategoryBySearchTerm,
  expandSearchQuery,
} from "./categoryMatcher.js";

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
  const orConditions: any[] = [];

  // Add search query conditions
  if (criteria.searchQuery) {
    // Create an array of search terms by splitting the query
    const searchTerms = criteria.searchQuery
      .split(" ")
      .filter((term) => term.length > 2)
      .map((term) => term.trim());

    // If we have valid search terms, add them to the OR conditions
    if (searchTerms.length > 0) {
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
    }
  }

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

  // Add category condition
  if (criteria.categoryId !== undefined) {
    whereClause.categoryId = criteria.categoryId;
  }

  // If we have OR conditions, add them to the where clause
  if (orConditions.length > 0) {
    whereClause.OR = orConditions;
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

  console.log(
    `Streaming products with query: "${searchQuery}", minPrice: ${searchMinPrice}, maxPrice: ${searchMaxPrice}`
  );

  // Normalize the search query
  const normalizedQuery = searchQuery.toLowerCase().trim();

  // Use the utility function to expand the search query with common variations
  const expandedQueries = expandSearchQuery(normalizedQuery);

  console.log(
    `Expanded search queries for streaming: ${expandedQueries.join(", ")}`
  );

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
    console.log(
      `Found matching category for streaming: ${matchedCategory.name} (ID: ${matchedCategory.id})`
    );
  }

  if (extractedCategory && !categoryIds.includes(extractedCategory.id)) {
    categoryIds.push(extractedCategory.id);
    console.log(
      `Extracted category from message for streaming: ${extractedCategory.name} (ID: ${extractedCategory.id})`
    );
  }

  console.log(`Found ${categoryIds.length} matching categories for streaming`);

  // Build the where clause with expanded queries
  const whereClause: any = {};

  // Initialize the OR array
  whereClause.OR = [];

  // Only add search conditions if we have a non-empty search query
  if (normalizedQuery) {
    // Add name matches
    expandedQueries.forEach((query) => {
      whereClause.OR.push({
        name: {
          contains: query,
          mode: "insensitive" as const,
        },
      });
    });

    // Add description matches
    expandedQueries.forEach((query) => {
      whereClause.OR.push({
        description: {
          contains: query,
          mode: "insensitive" as const,
        },
      });
    });
  }

  // Add category filter if we found matching categories
  if (categoryIds.length > 0) {
    whereClause.OR.push({
      categoryId: {
        in: categoryIds,
      },
    });
  }

  // If we have no search conditions, remove the empty OR array
  if (whereClause.OR.length === 0) {
    delete whereClause.OR;
  }

  // Apply price filter if specified
  if (searchMinPrice !== undefined || searchMaxPrice !== undefined) {
    // Add price filter directly to the where clause, not inside OR
    whereClause.price = {};

    if (searchMinPrice !== undefined) {
      whereClause.price.gte = searchMinPrice;
      console.log(
        `Applying minimum price filter for streaming: price >= ${searchMinPrice}`
      );
    }

    if (searchMaxPrice !== undefined) {
      whereClause.price.lte = searchMaxPrice;
      console.log(
        `Applying maximum price filter for streaming: price <= ${searchMaxPrice}`
      );
    }
  }

  // Log the complete where clause for debugging
  console.log(
    "Final WHERE clause for product streaming:",
    JSON.stringify(whereClause, null, 2)
  );

  const prisma = await getPrisma();

  // Execute the query
  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      images: true,
      category: true,
    },
    orderBy: {
      name: "asc",
    },
    take: 5,
  });

  console.log(`Found ${products.length} matching products for streaming`);

  let productsToStream = products;

  // Only do a price-only query if no products were found in the initial query
  // OR if we have a price-only query (no search terms)
  if (
    (products.length === 0 || whereClause.OR === undefined) &&
    (searchMinPrice !== undefined || searchMaxPrice !== undefined)
  ) {
    console.log(
      `No products found with combined query for streaming or price-only search requested. Trying price-only query...`
    );

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
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        price:
          searchMinPrice !== undefined && searchMaxPrice === undefined
            ? "desc"
            : "asc",
      },
      take: 5,
    });

    console.log(
      `Price-only query found ${priceOnlyProducts.length} products for streaming:`
    );
    priceOnlyProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
    });

    // Use the price-only products instead
    productsToStream = priceOnlyProducts;
  }

  // Yield each product one by one with a small delay to ensure frontend can process them
  for (const product of productsToStream) {
    console.log(`Streaming product: ${product.name} - $${product.price}`);
    yield product;

    // Small delay to ensure frontend can process each product
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
