import { Request, Response } from "express";
import ordersService from "./orders.service.js";
import { handleError } from "../../utils/handleErrors.js";
import { sendResponse } from "../../utils/apiResponse.js";

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
}

export default new OrdersController();
