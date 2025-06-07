import { Request, Response } from "express";
import ordersService from "./orders.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

// Add a custom interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Orders controller responsible for handling HTTP requests related to orders
 */
export class OrdersController {
  /**
   * Get order by order number
   */
  async getOrderByNumber(req: Request, res: Response) {
    try {
      const { orderNumber } = req.params;

      const order = await ordersService.getOrderByNumber(
        Number(orderNumber) || 0
      );

      sendResponse(res, 200, { success: true, data: order });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Create a new order (authenticated users only)
   */
  async createOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const orderData = req.body;
      const authenticatedUser = req.user;

      // Validate that the order email matches the authenticated user's email
      if (orderData.email !== authenticatedUser.email) {
        sendResponse(res, 403, {
          success: false,
          message: "You can only create orders with your own email address",
        });
        return;
      }

      const order = await ordersService.createOrder(orderData);

      sendResponse(res, 201, { success: true, data: order });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get orders for authenticated user
   */
  async getUserOrders(req: AuthenticatedRequest, res: Response) {
    try {
      const userEmail = req.user?.email;

      if (!userEmail) {
        sendResponse(res, 401, {
          success: false,
          message: "User email not found",
        });
        return;
      }

      const orders = await ordersService.getUserOrders(userEmail);
      sendResponse(res, 200, { success: true, data: orders });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new OrdersController();
