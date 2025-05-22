import express, { Request, Response } from "express";
import { handleError } from "../utils/handleErrors.js";
import { addCookie } from "../utils/cookieUtils.js";
import { sendResponse } from "../utils/apiResponse.js";
import { prisma } from "@repo/database";
import {
  getCartBySession,
  addOrUpdateCartItem as addOrUpdateCartItem,
  getUpdatedCart,
  updateItemQuantity,
} from "../repositories/cartRepository.js";
import { assignImageUrlToCart } from "../services/s3Service.js";
import { CartWithItems } from "@repo/database/types/cart";

const router = express.Router();

// Get existing cart or create one
router.get("/", async (req: Request, res: Response) => {
  try {
    const cartSession = req.cookies.cart_session;

    if (cartSession) {
      // Get existing cart
      const cart = await getCartBySession(cartSession);

      if (!cart) {
        return;
      }

      // add presigned URLs to images
      const cartWithPresignedUrls = await assignImageUrlToCart(
        cart as CartWithItems
      );

      sendResponse(res, 200, { success: true, data: cartWithPresignedUrls });
      return;
    } else {
      // Create new cart + session
      const newCart = await prisma.cart.create({ data: {} });
      addCookie(res, "cart_session", newCart.sessionId);
      sendResponse(res, 200, { success: true, data: newCart });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// Add item to cart
router.post("/", async (req: Request, res: Response) => {
  try {
    const { product, quantity } = req.body;
    const cartSession = req.cookies.cart_session;

    // Step 1: Find the Cart (It should already exist from GET /cart)
    const cart = await getCartBySession(cartSession);

    if (!cart) {
      sendResponse(res, 400, {
        success: false,
        message: "Cart does not exist. Please fetch the cart first.",
      });
      return;
    }

    // Step 2: Add Product to Cart or update Quantity
    await addOrUpdateCartItem(cart.id, product.id, product.price, quantity);

    // Step 3: Return Updated Cart with Sorted Items
    const updatedCart = await getUpdatedCart(cart.id);
    sendResponse(res, 201, { success: true, data: updatedCart });
  } catch (error) {
    handleError(error, res);
  }
});

// Edit cart item quantity
router.put("/", async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const session = req.cookies.cart_session;

    const result = await updateItemQuantity(session, productId, quantity);
    sendResponse(res, 200, { success: true, data: result });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
