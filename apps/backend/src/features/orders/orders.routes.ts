import express, { Router } from "express";
import ordersController from "./orders.controller.js";
import { authenticatedUser } from "#middleware/user-auth.js";

const router: Router = express.Router();

// Create a new order (requires authentication)
router.post(
  "/",
  authenticatedUser,
  ordersController.createOrder.bind(ordersController)
);

// Get user's orders (requires authentication)
router.get(
  "/user",
  authenticatedUser,
  ordersController.getUserOrders.bind(ordersController)
);

// Get order by id
router.get(
  "/:orderNumber",
  ordersController.getOrderByNumber.bind(ordersController)
);

export default router;
