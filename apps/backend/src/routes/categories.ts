import { prisma } from "@repo/database";
import express, { Request, Response } from "express";
import { handleError } from "../utils/handleErrors.js";
import { sendResponse } from "../utils/apiResponse.js";
import { assignImageUrlToProducts } from "../services/s3Service.js";
import { ProductWithImageUrl } from "@repo/database/types/product";

const router = express.Router();

// Get all categories names
router.get("/", async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();

    if (!categories) {
      sendResponse(res, 404, { success: false, message: "No categories found" });
      return;
    }

    sendResponse(res, 200, { success: true, data: categories });
  } catch (error) {
    handleError(error, res);
  }
});

// Get category by slug (product included)
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params; // Contains the plain text payload

    // Get category
    const category = await prisma.category.findUnique({
      where: { slug: slug },
      include: { products: { include: { images: true } } },
    });

    if (!category) {
      sendResponse(res, 404, { success: false, message: "No category found" });
      return;
    }

    category.products = await assignImageUrlToProducts(
      category.products as ProductWithImageUrl[]
    );

    sendResponse(res, 200, { success: true, data: category });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
