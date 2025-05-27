import { OrderInput } from "@repo/shared";
import adminOrdersRepository from "./admin.orders.repository.js";
import { prepareOrderItems } from "./admin.orders.utils.js";

/**
 * Admin orders service responsible for order management business logic
 */
export class AdminOrdersService {
  /**
   * Get all orders
   */
  async getAllOrders() {
    const orders = await adminOrdersRepository.findAll();

    if (!orders) {
      throw new Error("No orders found");
    }

    return orders;
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: OrderInput) {
    // Get userId based on email
    const user = await adminOrdersRepository.findUserByEmail(orderData.email);

    // Fetch all required products
    const productIds = orderData.orderItems.map((item) => item.productId);
    const products = await adminOrdersRepository.findProductsByIds(productIds);

    // Create a map for quick lookup
    const productMap = products.reduce(
      (map, product) => {
        map[product.id] = product;
        return map;
      },
      {} as Record<number, any>
    );

    const { orderItemsData, totalPrice } = prepareOrderItems(
      orderData,
      productMap
    );

    // Create the order
    await adminOrdersRepository.createOrder({
      shippingInfo: { create: orderData.shippingInfo },
      user: user ? { connect: { id: user.id } } : undefined,
      email: orderData.email,
      total: totalPrice,
      orderItems: {
        createMany: {
          data: orderItemsData,
        },
      },
    });

    return { success: true, message: "Order created successfully" };
  }

  /**
   * Update an order's status
   */
  async updateOrderStatus(orderId: string, status: string) {
    // Validate the status value
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      throw new Error(
        "Invalid status value. Must be one of: PENDING, PAID, SHIPPED, CANCELLED"
      );
    }

    // Check if order exists
    const existingOrder = await adminOrdersRepository.findById(orderId);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Update the order status
    const updatedOrder = await adminOrdersRepository.updateOrder(orderId, {
      status,
    });

    return {
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    };
  }
}

export default new AdminOrdersService();
