import { prisma } from "@repo/database";
import express, { Request, Response } from "express";
import { sendResponse } from "../utils/apiResponse.js";
import { handleError } from "../utils/handleErrors.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const countries = await prisma.country.findMany({
      where: {
        isShippingAvailable: true,
      },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
    if (!countries) {
      sendResponse(res, 404, { success: false, message: "No countries found" });
      return;
    }

    sendResponse(res, 200, { success: true, data: countries });
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
