import { CartWithItems } from "@repo/database/types/cart";
import cartRepository from "./cart.repository.js";
import { assignImageUrlToCart } from "@services/s3Service.js";

/**
 * Cart service responsible for cart-related business logic
 */
export class CartService {
  /**
   * Get existing cart by session or create a new one
   */
  async getOrCreateCart(cartSession?: string): Promise<{
    cart: any;
    isNewCart: boolean;
  }> {
    // Check if we have a valid session ID
    if (
      cartSession &&
      typeof cartSession === "string" &&
      cartSession.trim() !== ""
    ) {
      // Try to find the cart with this session
      const cart = await cartRepository.getCartBySession(cartSession);

      if (cart) {
        // Cart found, add presigned URLs
        const cartWithPresignedUrls = await assignImageUrlToCart(
          cart as CartWithItems
        );
        return { cart: cartWithPresignedUrls, isNewCart: false };
      }

      // Session exists in cookie but not in DB - create new cart
      console.log("Session exists in cookie but not in DB, creating new cart");
      const newCart = await cartRepository.createCart();
      return { cart: newCart, isNewCart: true };
    }

    // No valid session - create new cart
    console.log("No valid session, creating new cart");
    const newCart = await cartRepository.createCart();
    return { cart: newCart, isNewCart: true };
  }

  /**
   * Add item to cart
   */
  async addItemToCart(cartSession: string, product: any, quantity: number) {
    // Validate cart session
    if (
      !cartSession ||
      typeof cartSession !== "string" ||
      cartSession.trim() === ""
    ) {
      throw new Error("Missing valid cart session. Please reload the page.");
    }

    // Find the Cart (It should already exist from GET /cart)
    const cart = await cartRepository.getCartBySession(cartSession);

    if (!cart) {
      throw new Error("Cart not found. Please reload the page.");
    }

    // Add Product to Cart or update Quantity
    await cartRepository.addOrUpdateCartItem(
      cart.id,
      product.id,
      product.price,
      quantity
    );

    // Return Updated Cart with Sorted Items
    const updatedCart = await cartRepository.getUpdatedCart(cart.id);
    return updatedCart;
  }

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(
    sessionId: string,
    productId: number,
    quantity: number
  ) {
    return cartRepository.updateItemQuantity(sessionId, productId, quantity);
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(sessionId: string, productId: number) {
    return cartRepository.removeCartItem(sessionId, productId);
  }
}

export default new CartService();
