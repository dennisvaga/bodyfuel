import express, { Router } from "express";
import cartController from "./cart.controller.js";

const router: Router = express.Router();

// Get existing cart or create one
router.get("/", cartController.getCart.bind(cartController));

// Add item to cart
router.post("/", cartController.addToCart.bind(cartController));

// Edit cart item quantity
router.put("/", cartController.updateItemQuantity.bind(cartController));

// Remove item from cart
router.delete(
  "/items/:productId",
  cartController.removeCartItem.bind(cartController)
);

export default router;
