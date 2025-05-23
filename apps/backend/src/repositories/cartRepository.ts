import { prisma } from "@repo/database";

/**
 * Get cart by session ID with all items and images
 */
export async function getCartBySession(sessionId: string) {
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
export async function getUpdatedCart(cartId: number) {
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
 * Add a product to cart or increment its quantity
 */
export async function addOrUpdateCartItem(
  cartId: number,
  productId: number,
  price: number,
  quantity: number
) {
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
export async function updateItemQuantity(
  sessionId: string,
  productId: number,
  quantity: number
) {
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

export const removeCartItem = async (sessionId: string, productId: number) => {
  // Find the cart by session
  const cart = await getCartBySession(sessionId);

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
  return await getUpdatedCart(cart.id);
};
