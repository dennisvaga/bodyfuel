import express, { Router } from "express";
import ordersController from "./orders.controller.js";

const router: Router = express.Router();

// Get order by id
router.get(
  "/:orderNumber",
  ordersController.getOrderByNumber.bind(ordersController)
);

export default router;
