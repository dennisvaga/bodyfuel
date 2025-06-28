import express, { Router } from "express";
import adminOrdersController from "./admin.orders.controller.js";

const router: Router = express.Router();

// Get all orders
router.get("/", adminOrdersController.getAllOrders.bind(adminOrdersController));

// Update order status
router.patch(
  "/:orderId/status",
  adminOrdersController.updateOrderStatus.bind(adminOrdersController)
);

export default router;
