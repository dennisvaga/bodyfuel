import { getPrisma } from "@repo/database";
import { ProductData, ChatbotSearchCriteria } from "../types/chatTypes.js";
import {
  buildWhereClause,
  streamProducts,
} from "../utils/productSearchUtils.js";

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

    // Query the database
    const products = await prisma.product.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: {
          take: 1,
        },
        category: true,
      },
    });

    // Map the products to the expected format
    return products.map((product) => ({
      name: product.name,
      price: product.price,
      description: product.description || "No description available",
      imageUrl:
        product.images && product.images.length > 0
          ? `/api/images/${product.images[0].imageKey}`
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
