import { getPrisma } from "@repo/database";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import express, { Request, Response, Router } from "express";
import { handleError } from "../utils/handleErrors.js";
import { assignImageUrlToProducts } from "../services/s3Service.js";
import { sendResponse } from "../utils/apiResponse.js";
import {
  getPaginationMetaData,
  parsePaginationParams,
} from "../utils/paginationUtils.js";

const router: Router = express.Router();

// * Search products without pagination
router.get("/search", async (req: Request, res: Response) => {
  try {
    const prisma = await getPrisma();

    const { search } = req.query;

    const products = await prisma.product.findMany({
      where: search
        ? {
            name: { contains: search as string, mode: "insensitive" },
          }
        : undefined,
      include: {
        images: true,
        options: { include: { optionValues: true } },
        variants: { include: { variantOptionValues: true } },
      },
      take: 100, // Limit results for performance
    });

    if (products.length === 0) {
      sendResponse(res, 404, { success: false, message: "No products found" });
      return;
    }

    const productsWithPresignedUrls = await assignImageUrlToProducts(
      products as ProductWithImageUrl[]
    );

    sendResponse(res, 200, {
      success: true,
      data: productsWithPresignedUrls,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get products with pagination
router.get("/", async (req: Request, res: Response) => {
  const getAllProducts = req.query.getAllProducts === "true";

  try {
    const prisma = await getPrisma();
    // If getAllProducts is true, skip pagination
    if (getAllProducts) {
      const products = await prisma.product.findMany({
        include: {
          images: true,
          options: { include: { optionValues: true } },
          variants: { include: { variantOptionValues: true } },
        },
      });

      if (products.length === 0) {
        sendResponse(res, 404, {
          success: false,
          message: "No products found",
        });
        return;
      }

      const productsWithPresignedUrls = await assignImageUrlToProducts(
        products as ProductWithImageUrl[]
      );

      sendResponse(res, 200, {
        success: true,
        data: productsWithPresignedUrls,
      });
      return;
    }

    // If getAllProducts is false, use pagination
    const { currentPage, itemsPerPage, skip } = parsePaginationParams(
      req.query
    );

    const [totalItems, products] = await prisma.$transaction([
      // Query 1: Get total count of products
      prisma.product.count(),

      // Query 2: Fetch products with their associated images
      prisma.product.findMany({
        skip,
        take: itemsPerPage,
        include: {
          images: true,
          options: { include: { optionValues: true } },
          variants: { include: { variantOptionValues: true } },
        },
      }),
    ]);

    if (products.length === 0) {
      sendResponse(res, 404, { success: false, message: "No products found" });
      return;
    }

    const productsWithPresignedUrls = await assignImageUrlToProducts(
      products as ProductWithImageUrl[]
    );

    const paginationData = getPaginationMetaData(
      currentPage,
      totalItems,
      itemsPerPage
    );

    sendResponse(res, 200, {
      success: true,
      data: productsWithPresignedUrls,
      pagination: paginationData,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get product by slug
router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const prisma = await getPrisma();
    // Fetch products with their associated images
    const products = await prisma.product.findMany({
      where: { slug },
      include: {
        images: true,
        options: { include: { optionValues: true } },
        variants: {
          include: { variantOptionValues: { include: { optionValue: true } } },
        },
        collections: true,
      },
    });

    if (products.length === 0) {
      sendResponse(res, 404, { success: false, message: "No products found" });
      return;
    }

    const productsWithPresignedUrls = await assignImageUrlToProducts(
      products as ProductWithImageUrl[]
    );

    sendResponse(res, 200, {
      success: true,
      data: productsWithPresignedUrls[0],
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
