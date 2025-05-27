import { getPrisma } from "@repo/database";

/**
 * Countries repository responsible for all database operations related to countries
 */
export class CountriesRepository {
  /**
   * Find all countries where shipping is available
   */
  async findAllShippingAvailable() {
    const prisma = await getPrisma();

    return prisma.country.findMany({
      where: {
        isShippingAvailable: true,
      },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }
}

export default new CountriesRepository();
