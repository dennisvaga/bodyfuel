import { Request, Response } from "express";
import adminOrdersService from "./admin.orders.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Admin orders controller responsible for handling HTTP requests related to admin order management
 */
export class AdminOrdersController {
  /**
   * Get all orders
   */
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await adminOrdersService.getAllOrders();

      sendResponse(res, 200, { success: true, data: orders });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Update an order's status
   */
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const result = await adminOrdersService.updateOrderStatus(
        orderId,
        status
      );

      sendResponse(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.message === "Order not found") {
        sendResponse(res, 404, { success: false, message: error.message });
        return;
      }

      if (
        error instanceof Error &&
        error.message.includes("Invalid status value")
      ) {
        sendResponse(res, 400, { success: false, message: error.message });
        return;
      }

      handleError(error, res);
    }
  }
}

export default new AdminOrdersController();
