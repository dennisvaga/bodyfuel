import { getPrisma } from "@repo/database";

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
          include: {
            images: true,
            options: { include: { optionValues: true } },
            variants: {
              include: {
                variantOptionValues: { include: { optionValue: true } },
              },
            },
          },
        },
      },
    });
  }
}

export default new CategoriesRepository();
