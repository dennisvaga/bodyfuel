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
