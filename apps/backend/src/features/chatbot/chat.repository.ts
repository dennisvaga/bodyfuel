import { getPrisma } from "@repo/database";
import { ProductData, ChatbotSearchCriteria } from "@repo/shared";
import {
  buildWhereClause,
  streamProducts,
} from "./utils/product-search-utils.js";
import { assignImageUrlToProducts } from "#services/s3Service.js";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { PRODUCT_FULL_INCLUDE } from "@repo/database/includes/product-includes";

// Re-export streamProducts for backward compatibility
export { streamProducts };

/**
 * Find products based on search criteria
 *
 * @param criteria Search criteria
 * @param limit Maximum number of products to return
 * @returns Array of products
 */
export async function findProducts(
  criteria: ChatbotSearchCriteria,
  limit: number = 10
): Promise<ProductData[]> {
  try {
    const prisma = await getPrisma();

    // Build the where clause based on the criteria
    const whereClause: any = buildWhereClause(criteria);

    // Query the database with the full structure needed for S3 service
    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: PRODUCT_FULL_INCLUDE,
    });

    // Use S3 service to assign proper image URLs
    const productsWithImageUrls = assignImageUrlToProducts(
      products as unknown as ProductWithImageUrl[]
    );

    // Map the products to the expected format
    return productsWithImageUrls.map((product) => ({
      name: product.name,
      price: product.price,
      description: product.description || "No description available",
      imageUrl:
        product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : "/media/blankImage.jpg",
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error finding products:", error);
    return [];
  }
}

/**
 * Find category by name
 *
 * @param name Category name
 * @returns Category ID or null if not found
 */
export async function findCategoryByName(name: string): Promise<number | null> {
  const prisma = await getPrisma();

  try {
    const category = await prisma.category.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    return category?.id ?? null;
  } catch (error) {
    console.error("Error finding category by name:", error);
    return null;
  }
}
