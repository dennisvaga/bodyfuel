import ordersRepository from "./orders.repository.js";
import { assignImageUrlToOrder } from "#services/s3Service.js";
import { OrderInput } from "@repo/shared";
import adminOrdersRepository from "../admin/orders/admin.orders.repository.js";
import { prepareOrderItems } from "../admin/orders/admin.orders.utils.js";

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

  /**
   * Create a new order (public endpoint with validation)
   */
  async createOrder(orderData: OrderInput) {
    // 1. Validate input data
    this.validateOrderInput(orderData);

    // 2. Get userId based on email
    const user = await adminOrdersRepository.findUserByEmail(orderData.email);

    // 3. Fetch all required products from database
    const productIds = orderData.orderItems.map((item) => item.productId);
    const products = await adminOrdersRepository.findProductsByIds(productIds);

    // 4. Validate all products exist
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const missingIds = productIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Products not found: ${missingIds.join(", ")}`);
    }

    // 5. Create a map for quick lookup
    const productMap = products.reduce(
      (map, product) => {
        map[product.id] = product;
        return map;
      },
      {} as Record<number, any>
    );

    // 6. Recalculate prices from database (don't trust frontend)
    const { orderItemsData, totalPrice } = this.validateAndCalculatePrices(
      orderData,
      productMap
    );

    // 7. Create the order with validated data
    await adminOrdersRepository.createOrder({
      shippingInfo: { create: orderData.shippingInfo },
      user: user ? { connect: { id: user.id } } : undefined,
      email: orderData.email,
      total: totalPrice,
      status: "PENDING", // Force PENDING status for public orders
      orderItems: {
        createMany: {
          data: orderItemsData,
        },
      },
    });

    return { success: true, message: "Order created successfully" };
  }

  /**
   * Validate order input data
   */
  private validateOrderInput(orderData: OrderInput) {
    if (!orderData.email || !orderData.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    if (!orderData.orderItems || orderData.orderItems.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    if (!orderData.shippingInfo) {
      throw new Error("Shipping information is required");
    }

    // Validate each order item
    orderData.orderItems.forEach((item, index) => {
      if (!item.productId || item.productId <= 0) {
        throw new Error(`Invalid product ID at item ${index + 1}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error(`Invalid quantity at item ${index + 1}`);
      }
      if (item.quantity > 99) {
        throw new Error(`Quantity too high at item ${index + 1} (max: 99)`);
      }
    });

    // Validate shipping info
    const { shippingInfo } = orderData;
    if (!shippingInfo.firstName || !shippingInfo.lastName) {
      throw new Error("First name and last name are required");
    }
    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode
    ) {
      throw new Error("Complete address is required");
    }
  }

  /**
   * Validate and calculate prices from database
   */
  private validateAndCalculatePrices(
    orderData: OrderInput,
    productMap: Record<number, any>
  ) {
    let calculatedTotal = 0;

    const orderItemsData = orderData.orderItems.map((item) => {
      const product = productMap[item.productId];

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new Error(`Product "${product.name}" is no longer available`);
      }

      // Use database price, not frontend price
      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price, // Use database price
      };
    });

    return {
      orderItemsData,
      totalPrice: calculatedTotal, // Use calculated total
    };
  }
}

export default new OrdersService();
