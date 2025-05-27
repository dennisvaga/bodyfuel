import { getPrisma } from "@repo/database";

/**
 * Admin orders repository responsible for all database operations related to admin order management
 */
export class AdminOrdersRepository {
  /**
   * Find all orders
   */
  async findAll() {
    const prisma = await getPrisma();
    return prisma.order.findMany({
      include: { shippingInfo: true, user: true, orderItems: true },
    });
  }

  /**
   * Find a user by email
   */
  async findUserByEmail(email: string) {
    const prisma = await getPrisma();
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find products by IDs
   */
  async findProductsByIds(productIds: number[]) {
    const prisma = await getPrisma();
    return prisma.product.findMany({
      where: { id: { in: productIds } },
    });
  }

  /**
   * Create an order
   */
  async createOrder(orderData: any) {
    const prisma = await getPrisma();
    return prisma.order.create({ data: orderData });
  }

  /**
   * Find an order by ID
   */
  async findById(orderId: string) {
    const prisma = await getPrisma();
    return prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  /**
   * Update an order
   */
  async updateOrder(orderId: string, data: any) {
    const prisma = await getPrisma();
    return prisma.order.update({
      where: { id: orderId },
      data,
      include: { shippingInfo: true, orderItems: true },
    });
  }
}

export default new AdminOrdersRepository();
