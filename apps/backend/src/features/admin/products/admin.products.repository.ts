import { getPrisma } from "@repo/database";
import { ProductInput } from "@repo/shared";

/**
 * Admin products repository responsible for all database operations related to admin product management
 */
export class AdminProductsRepository {
  /**
   * Find a product by ID
   */
  async findById(productId: number) {
    const prisma = await getPrisma();
    return prisma.product.findUnique({
      where: { id: productId },
    });
  }

  /**
   * Create a product
   */
  async createProduct(productData: any) {
    const prisma = await getPrisma();
    return prisma.product.create({ data: productData });
  }

  /**
   * Update a product
   */
  async updateProduct(productId: number, dataToUpdate: any) {
    const prisma = await getPrisma();
    return prisma.product.update({
      where: { id: productId },
      data: dataToUpdate,
    });
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: number) {
    const prisma = await getPrisma();
    return prisma.product.delete({ where: { id: productId } });
  }

  /**
   * Delete product images
   */
  async deleteProductImages(productId: number) {
    const prisma = await getPrisma();
    return prisma.productImage.deleteMany({
      where: { productId },
    });
  }

  /**
   * Execute a transaction
   */
  async executeTransaction(callback: (tx: any) => Promise<void>) {
    const prisma = await getPrisma();
    return prisma.$transaction(callback);
  }
}

export default new AdminProductsRepository();
