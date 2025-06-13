import { Request, Response } from "express";
import cartService from "./cart.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";
import { addCookie } from "#utils/cookie-utils.js";

/**
 * Cart controller responsible for handling HTTP requests related to cart
 */
export class CartController {
  /**
   * Get existing cart or create one
   */
  async getCart(req: Request, res: Response) {
    try {
      // Get the cart session cookie
      const cartSession = req.cookies.cart_session;

      const { cart, isNewCart } =
        await cartService.getOrCreateCart(cartSession);

      // If it's a new cart, update the cookie
      if (isNewCart) {
        addCookie(res, "cart_session", cart.sessionId);
      }

      sendResponse(res, 200, { success: true, data: cart });
    } catch (error) {
      console.error("Cart error:", error);
      handleError(error, res);
    }
  }

  /**
   * Add item to cart
   */
  async addToCart(req: Request, res: Response) {
    try {
      const { product, quantity, variantId } = req.body;
      const cartSession = req.cookies.cart_session;

      const updatedCart = await cartService.addItemToCart(
        cartSession,
        product,
        quantity,
        variantId
      );

      sendResponse(res, 201, { success: true, data: updatedCart });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Update item quantity in cart
   */
  async updateItemQuantity(req: Request, res: Response) {
    try {
      const { productId, quantity, variantId } = req.body;
      const session = req.cookies.cart_session;

      const result = await cartService.updateItemQuantity(
        session,
        productId,
        quantity,
        variantId
      );
      sendResponse(res, 200, { success: true, data: result });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Remove item from cart
   */
  async removeCartItem(req: Request, res: Response) {
    try {
      const productId = parseInt(req.params.productId);
      const { variantId } = req.query; // Get variantId from query params
      const session = req.cookies.cart_session;

      const parsedVariantId = variantId ? parseInt(variantId as string) : null;
      const updatedCart = await cartService.removeCartItem(
        session,
        productId,
        parsedVariantId
      );
      sendResponse(res, 200, { success: true, data: updatedCart });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new CartController();
