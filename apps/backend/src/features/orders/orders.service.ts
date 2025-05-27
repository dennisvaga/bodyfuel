import ordersRepository from "./orders.repository.js";

/**
 * Orders service responsible for order-related business logic
 */
export class OrdersService {
  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: number) {
    const order = await ordersRepository.findByOrderNumber(orderNumber);

    if (!order) {
      throw new Error("No orders found");
    }

    return order;
  }
}

export default new OrdersService();
