import { getPrisma } from "@repo/database";
import { PRODUCT_BASIC_INCLUDE } from "@repo/database/includes/product-includes";

/**
 * Collections repository responsible for all database operations related to collections
 */
export class CollectionsRepository {
  /**
   * Find all collections with optional product inclusion
   */
  async findAll(
    includeProducts: boolean = false,
    skip?: number,
    take?: number
  ) {
    const prisma = await getPrisma();

    // Base query options
    let queryOptions: any = {};

    // Add products if requested
    if (includeProducts) {
      queryOptions.include = {
        products: {
          include: PRODUCT_BASIC_INCLUDE,
        },
      };
    }

    // Add pagination if provided
    if (skip !== undefined && take !== undefined) {
      queryOptions = {
        ...queryOptions,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      };
    }

    return prisma.collection.findMany(queryOptions);
  }

  /**
   * Count all collections
   */
  async count() {
    const prisma = await getPrisma();
    return prisma.collection.count();
  }

  /**
   * Find collection by slug with paginated products
   */
  async findBySlugWithPaginatedProducts(
    slug: string,
    skip: number,
    take: number
  ) {
    const prisma = await getPrisma();

    return prisma.$transaction([
      // Query 1: Get total count of products in this collection
      prisma.product.count({
        where: {
          collections: {
            some: { slug },
          },
        },
      }),

      // Query 2: Get the collection with paginated products
      prisma.collection.findUnique({
        where: { slug },
        include: {
          products: {
            include: PRODUCT_BASIC_INCLUDE,
            skip,
            take,
            orderBy: { createdAt: "desc" }, // Default sorting
          },
        },
      }),
    ]);
  }
}

export default new CollectionsRepository();
