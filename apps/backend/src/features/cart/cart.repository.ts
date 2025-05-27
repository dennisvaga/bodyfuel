import { getPrisma } from "@repo/database";

/**
 * Cart repository responsible for all database operations related to cart
 */
export class CartRepository {
  /**
   * Get cart by session ID with all items and images
   */
  async getCartBySession(sessionId: string) {
    const prisma = await getPrisma();
    return prisma.cart.findUnique({
      where: { sessionId },
      include: {
        cartItems: {
          include: { product: { include: { images: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Get updated cart with all items and product details
   */
  async getUpdatedCart(cartId: number) {
    const prisma = await getPrisma();

    return prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        cartItems: {
          include: { product: { include: { images: true } } },
          orderBy: { createdAt: "asc" }, // Ensures stable order in UI
        },
      },
    });
  }

  /**
   * Create a new cart
   */
  async createCart() {
    const prisma = await getPrisma();
    return prisma.cart.create({ data: {} });
  }

  /**
   * Add a product to cart or increment its quantity
   */
  async addOrUpdateCartItem(
    cartId: number,
    productId: number,
    price: number,
    quantity: number
  ) {
    const prisma = await getPrisma();

    return prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId }, // Uses unique constraint
      },
      update: {
        quantity,
      },
      create: {
        cartId,
        productId,
        price, // Store price at time of adding
        quantity,
      },
    });
  }

  /**
   * Update cart item quantity or remove if quantity is less than 1
   */
  async updateItemQuantity(
    sessionId: string,
    productId: number,
    quantity: number
  ) {
    const prisma = await getPrisma();

    if (quantity < 1) {
      // Delete item from cart
      return prisma.cartItem.deleteMany({
        where: {
          cart: {
            sessionId,
          },
          productId,
        },
      });
    } else {
      // Update cart quantity
      return prisma.cartItem.updateMany({
        where: {
          cart: {
            sessionId,
          },
          productId,
        },
        data: {
          quantity,
        },
      });
    }
  }

  /**
   * Remove an item from the cart
   */
  async removeCartItem(sessionId: string, productId: number) {
    const prisma = await getPrisma();

    // Find the cart by session
    const cart = await this.getCartBySession(sessionId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Delete the cart item
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    // Return updated cart
    return await this.getUpdatedCart(cart.id);
  }
}

export default new CartRepository();
