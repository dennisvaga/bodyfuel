import { getPrisma } from "@repo/database";
import { CollectionInput } from "@repo/shared";

/**
 * Admin collections repository responsible for all database operations related to admin collection management
 */
export class AdminCollectionsRepository {
  /**
   * Find a collection by ID
   */
  async findById(collectionId: number) {
    const prisma = await getPrisma();
    return prisma.collection.findUnique({
      where: { id: collectionId },
      include: { products: true },
    });
  }

  /**
   * Create a collection
   */
  async createCollection(collectionData: any) {
    const prisma = await getPrisma();
    return prisma.collection.create({ data: collectionData });
  }

  /**
   * Update a collection
   */
  async updateCollection(collectionId: number, dataToUpdate: any) {
    const prisma = await getPrisma();
    return prisma.collection.update({
      where: { id: collectionId },
      data: dataToUpdate,
    });
  }

  /**
   * Delete a collection
   */
  async deleteCollection(collectionId: number) {
    const prisma = await getPrisma();
    return prisma.collection.delete({ where: { id: collectionId } });
  }
}

export default new AdminCollectionsRepository();
