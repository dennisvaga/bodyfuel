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
   * Find products by IDs (including variants for stock checking)
   */
  async findProductsByIds(productIds: number[]) {
    const prisma = await getPrisma();
    return prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        variants: true, // Include variants for stock checking
      },
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
   * Create an order and reduce stock atomically
   */
  async createOrderWithStockReduction(orderData: any, orderItems: any[]) {
    const prisma = await getPrisma();

    return prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({ data: orderData });

      // 2. Reduce stock for each order item
      for (const item of orderItems) {
        if (item.variantId) {
          // Reduce variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Reduce product quantity
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return order;
    });
  }

  /**
   * Find orders by user email
   */
  async findOrdersByUserEmail(userEmail: string) {
    const prisma = await getPrisma();

    return prisma.order.findMany({
      where: { email: userEmail },
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
      orderBy: { createdAt: "desc" },
    });
  }
}

export default new OrdersRepository();
