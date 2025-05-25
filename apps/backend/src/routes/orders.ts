import { getPrisma } from "@repo/database";
import express, { Request, Response, Router } from "express";
import { handleError } from "../utils/handleErrors.js";
import { sendResponse } from "../utils/apiResponse.js";

const router: Router = express.Router();

// Get order by id
router.get("/:orderNumber", async (req: Request, res: Response) => {
  // ToDo - Secure so only the use that that own this oreder can see it
  try {
    const prisma = await getPrisma();

    const { orderNumber } = req.params;

    const orders = await prisma.order.findUnique({
      where: { orderNumber: Number(orderNumber) || 0 },
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

export default router;
