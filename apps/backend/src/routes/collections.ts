import { prisma } from "@repo/database";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import express, { Request, Response, Router } from "express";
import { assignImageUrlToProducts } from "../services/s3Service.js";
import { handleError } from "../utils/handleErrors.js";
import { sendResponse } from "../utils/apiResponse.js";
import {
  getPaginationMetaData,
  parsePaginationParams,
} from "../utils/paginationUtils.js";

const router: Router = express.Router();

// Get collection by slug with paginated products
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { currentPage, itemsPerPage, skip } = parsePaginationParams(
      req.query
    );

    // Use transaction for efficiency (runs both queries at once)
    const [totalCount, collectionWithProducts] = await prisma.$transaction([
      // Query 1: Get total count of products in this collection
      prisma.product.count({
        where: {
          collections: {
            some: { slug },
          },
        },
      }),

      // Query 2: Get the collection with paginated products
      prisma.collection.findUnique({
        where: { slug },
        include: {
          products: {
            include: { images: true },
            skip,
            take: itemsPerPage,
            orderBy: { createdAt: "desc" }, // Default sorting
          },
        },
      }),
    ]);

    if (!collectionWithProducts) {
      sendResponse(res, 404, {
        success: false,
        message: "No collection found",
      });
      return;
    }

    // Assign image URLs to products
    collectionWithProducts.products = await assignImageUrlToProducts(
      collectionWithProducts.products as ProductWithImageUrl[]
    );

    // Create pagination metadata
    const paginationData = getPaginationMetaData(
      currentPage,
      totalCount,
      itemsPerPage
    );

    sendResponse(res, 200, {
      success: true,
      data: collectionWithProducts,
      pagination: paginationData,
    });
  } catch (error) {
    handleError(error, res);
  }
});

// Get all collections
router.get("/", async (req: Request, res: Response) => {
  try {
    const includeProducts = req.query.includeProducts === "true";
    const usePagination = req.query.paginate === "true";
    const { currentPage, itemsPerPage, skip } = parsePaginationParams(
      req.query
    );

    // Base query options
    let queryOptions: any = {};

    // Add products if requested
    if (includeProducts) {
      queryOptions.include = {
        products: {
          include: { images: true },
        },
      };
    }

    // Add pagination if requested
    if (usePagination) {
      // Get count for pagination
      const totalCount = await prisma.collection.count();

      // Add pagination to query
      queryOptions = {
        ...queryOptions,
        skip,
        take: itemsPerPage,
        orderBy: { createdAt: "desc" },
      };

      // Get collections with pagination
      const collections = await prisma.collection.findMany(queryOptions);

      if (!collections.length) {
        sendResponse(res, 404, {
          success: false,
          message: "No collections found",
        });
        return;
      }

      // Send response with pagination data
      sendResponse(res, 200, {
        success: true,
        data: collections,
        pagination: getPaginationMetaData(
          currentPage,
          totalCount,
          itemsPerPage
        ),
      });
      return;
    }

    // Non-paginated query
    const collections = await prisma.collection.findMany(queryOptions);

    if (!collections.length) {
      sendResponse(res, 404, {
        success: false,
        message: "No collections found",
      });
      return;
    }

    sendResponse(res, 200, { success: true, data: collections });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
