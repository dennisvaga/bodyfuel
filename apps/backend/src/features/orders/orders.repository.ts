import { getPrisma } from "@repo/database";

/**
 * Orders repository responsible for all database operations related to orders
 */
export class OrdersRepository {
  /**
   * Find order by order number
   */
  async findByOrderNumber(orderNumber: number) {
    const prisma = await getPrisma();

    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        shippingInfo: true,
        user: true,
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }
}

export default new OrdersRepository();
