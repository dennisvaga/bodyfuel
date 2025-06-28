import ordersRepository from "./orders.repository.js";
import { assignImageUrlToOrder } from "#services/s3Service.js";
import { OrderInput } from "@repo/shared";

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
    const user = await ordersRepository.findUserByEmail(orderData.email);

    // 3. Fetch all required products from database
    const productIds = orderData.orderItems.map((item) => item.productId);
    const products = await ordersRepository.findProductsByIds(productIds);

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

    // 6. Validate stock availability
    this.validateStockAvailability(orderData, productMap);

    // 7. Recalculate prices from database (don't trust frontend)
    const { orderItemsData, totalPrice } = this.validateAndCalculatePrices(
      orderData,
      productMap
    );

    // 8. Create the order with validated data and reduce stock
    await ordersRepository.createOrderWithStockReduction(
      {
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
      },
      orderData.orderItems // Pass original order items for stock reduction
    );

    return { success: true, message: "Order created successfully" };
  } /**
   * Get orders for a specific user by email
   */
  async getUserOrders(userEmail: string) {
    const orders = await ordersRepository.findOrdersByUserEmail(userEmail);

    if (!orders || orders.length === 0) {
      return [];
    }

    // Add image URLs to orders
    return await Promise.all(
      orders.map(async (order: any) => await assignImageUrlToOrder(order))
    );
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
   * Validate stock availability for all order items
   */
  private validateStockAvailability(
    orderData: OrderInput,
    productMap: Record<number, any>
  ) {
    orderData.orderItems.forEach((item) => {
      const product = productMap[item.productId];

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // For products with variants, check variant stock
      if (product.variants && product.variants.length > 0) {
        // If product has variants but no variantId specified, throw error
        if (!item.variantId) {
          throw new Error(`Please select a variant for ${product.name}`);
        }

        const variant = product.variants.find(
          (v: any) => v.id === item.variantId
        );
        if (!variant) {
          throw new Error(`Variant not found for ${product.name}`);
        }

        if (variant.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`
          );
        }
      } else {
        // For simple products, check product quantity
        if (product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }
      }
    });
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

      let itemPrice = product.price; // Default to product price

      // If variant is specified, use variant price
      if (item.variantId && product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v: any) => v.id === item.variantId
        );
        if (variant) {
          itemPrice = variant.price;
        }
      }

      const itemTotal = itemPrice * item.quantity;
      calculatedTotal += itemTotal;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: itemPrice, // Use calculated price (product or variant)
      };
    });

    return {
      orderItemsData,
      totalPrice: calculatedTotal, // Use calculated total
    };
  }
}

export default new OrdersService();
