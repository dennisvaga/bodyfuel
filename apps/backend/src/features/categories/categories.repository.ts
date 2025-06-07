import { getPrisma } from "@repo/database";
import { PRODUCT_BASIC_INCLUDE } from "@repo/database/includes/product-includes";

/**
 * Categories repository responsible for all database operations related to categories
 */
export class CategoriesRepository {
  /**
   * Find all categories
   */
  async findAll() {
    const prisma = await getPrisma();
    return prisma.category.findMany();
  }

  /**
   * Find category by slug with products
   */
  async findBySlug(slug: string) {
    const prisma = await getPrisma();

    return prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: PRODUCT_BASIC_INCLUDE,
        },
      },
    });
  }
}

export default new CategoriesRepository();
