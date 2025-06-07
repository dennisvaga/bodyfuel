import ordersRepository from "./orders.repository.js";
import { assignImageUrlToOrder } from "#services/s3Service.js";

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

    // Transform imageKey to imageUrl for product images
    return await assignImageUrlToOrder(order);
  }
}

export default new OrdersService();
