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
          include: {
            product: { include: { images: true } },
            variant: {
              include: {
                variantOptionValues: {
                  include: {
                    optionValue: {
                      include: { option: true },
                    },
                  },
                },
              },
            },
          },
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
          include: {
            product: { include: { images: true } },
            variant: {
              include: {
                variantOptionValues: {
                  include: {
                    optionValue: {
                      include: { option: true },
                    },
                  },
                },
              },
            },
          },
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
   * Get variant by ID with price and stock
   */
  async getVariantById(variantId: number) {
    const prisma = await getPrisma();
    return prisma.productVariant.findUnique({
      where: { id: variantId },
      select: {
        id: true,
        price: true,
        stock: true,
        productId: true,
      },
    });
  }

  /**
   * Add a product to cart or increment its quantity
   */
  async addOrUpdateCartItem(
    cartId: number,
    productId: number,
    price: number,
    quantity: number,
    variantId?: number | null
  ) {
    const prisma = await getPrisma();

    // Check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // Update existing item with new quantity and price
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity, price },
      });
    } else {
      // Create new item
      return prisma.cartItem.create({
        data: {
          cartId,
          productId,
          variantId: variantId || null,
          price,
          quantity,
        },
      });
    }
  }

  /**
   * Update cart item quantity or remove if quantity is less than 1
   */
  async updateItemQuantity(
    sessionId: string,
    productId: number,
    quantity: number,
    variantId?: number | null
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
          variantId: variantId || null,
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
          variantId: variantId || null,
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
  async removeCartItem(
    sessionId: string,
    productId: number,
    variantId?: number | null
  ) {
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
        variantId: variantId || null,
      },
    });

    // Return updated cart
    return await this.getUpdatedCart(cart.id);
  }
}

export default new CartRepository();
