import { prisma } from "@repo/database";
import express, { Request, Response, Router } from "express";
import { handleError } from "../../utils/handleErrors.js";
import { OrderInput } from "@repo/shared";
import { Product } from "@prisma/client";
import { sendResponse } from "../../utils/apiResponse.js";
import { prepareOrderItems } from "../../services/orderService.js";

const router: Router = express.Router();

// Get all orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { shippingInfo: true, user: true, orderItems: true },
    });

    if (!orders) {
      sendResponse(res, 404, { success: false, message: "No orders found" });
      return;
    }

    sendResponse(res, 200, { success: true, data: orders });
  } catch (error) {
    handleError(error, res);
  }
});

// Add order
router.post("/", async (req: Request, res: Response) => {
  // EstimatedDelivery  - Optional
  // shippingCost       - Optional

  try {
    const orderData: OrderInput = req.body;

    // Get userId based on email
    const user = await prisma.user.findUnique({
      where: { email: orderData.email },
    });

    // Fetch all required products
    const productIds = orderData.orderItems.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Create a map for quick lookup
    const productMap = products.reduce<Record<number, Product>>(
      (map, product) => {
        map[product.id] = product;
        return map;
      },
      {}
    );

    const { orderItemsData, totalPrice } = prepareOrderItems(
      orderData,
      productMap
    );

    // Create the order
    await prisma.order.create({
      data: {
        shippingInfo: { create: orderData.shippingInfo },
        user: user ? { connect: { id: user.id } } : undefined,
        email: orderData.email,
        total: totalPrice,
        orderItems: {
          createMany: {
            data: orderItemsData, // Now a plain array of objects
          },
        },
      },
    });

    sendResponse(res, 201, {
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Update order status
router.patch("/:orderId/status", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status value
    const validStatuses = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      sendResponse(res, 400, {
        success: false,
        message:
          "Invalid status value. Must be one of: PENDING, PAID, SHIPPED, CANCELLED",
      });
      return;
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      sendResponse(res, 404, { success: false, message: "Order not found" });
      return;
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { shippingInfo: true, orderItems: true },
    });

    sendResponse(res, 200, {
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
