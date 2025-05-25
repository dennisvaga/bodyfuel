import { getPrisma } from "@repo/database";
import express, { Request, Response, Router } from "express";
import multer from "multer";
import { handleError } from "../../utils/handleErrors.js";
import { normalizeFiles, slugifyNative } from "../../utils/utils.js";
import { parseProductBody } from "@repo/shared";
import { productSchema, ProductInput } from "@repo/shared";
import { validateData } from "@repo/shared";
import { sendResponse } from "../../utils/apiResponse.js";
import {
  uploadProductImages,
  prepareProductCreateData,
  prepareProductUpdateData,
} from "../../services/productService.js";
import {
  createProductOptions,
  createProductVariants,
  updateProductOptions,
  updateProductVariants,
} from "../../repositories/productRepository.js";

const router: Router = express.Router();
const upload = multer(); // In-memory storage

/**
 * Add product
 * Multi-Step Logic is used here because we need to map temporary IDs from the frontend
 * to the actual database IDs created during the process.
 * This ensures the correct relationships between product options, values, and variants.
 * @param request
 * @returns
 */
router.post("/", upload.any(), async (req: Request, res: Response) => {
  // Make sure nobody except admin can send this
  try {
    const prisma = await getPrisma();
    const body = parseProductBody(req.body);
    const images = normalizeFiles(req.files);
    const validatedData: ProductInput = validateData(productSchema, body);

    // Normalize files to always be an array
    // Upload images to S3 (if any exist)
    const imageKeys = await uploadProductImages(images);

    const slug = slugifyNative(validatedData.name);

    // Store mappings from the frontend "temp" ID to the actual DB ID.
    const tempOptValueIdToRealId: Record<string, number> = {};

    // Transaction is used so all writes succeed or fail together.
    await prisma.$transaction(async (tx) => {
      // ------------------------------------------------------------------
      // 1) CREATE THE PRODUCT
      // ------------------------------------------------------------------
      const productData = prepareProductCreateData(
        validatedData,
        slug,
        imageKeys
      );
      const createdProduct = await tx.product.create({ data: productData });

      // ------------------------------------------------------------------
      // 2) CREATE PRODUCT OPTIONS + OPTION VALUES
      // ------------------------------------------------------------------
      if (validatedData.options?.length) {
        await createProductOptions(
          tx,
          createdProduct.id,
          validatedData.options,
          tempOptValueIdToRealId
        );
      }

      // ------------------------------------------------------------------
      // 3) CREATE PRODUCT VARIANTS + VARIANT OPTION VALUES
      // ------------------------------------------------------------------
      if (validatedData.variants?.length) {
        await createProductVariants(
          tx,
          createdProduct.id,
          validatedData.variants,
          tempOptValueIdToRealId
        );
      }
    });

    sendResponse(res, 201, {
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    handleError(error, res, true);
  }
});

// Edit Product
router.put(
  "/:id",
  upload.any(),
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const productId = parseInt(id);
    try {
      const prisma = await getPrisma();
      const body = parseProductBody(req.body);
      const images = normalizeFiles(req.files);
      const validatedData: ProductInput = validateData(productSchema, body);
      const originalProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!originalProduct) {
        sendResponse(res, 404, {
          success: false,
          message: "Product not found",
        });
        return;
      }
      // upload images
      const imageKeys = await uploadProductImages(images);

      // Use a transaction for image handling and product update
      await prisma.$transaction(async (tx) => {
        // Prepare update data
        const dataToUpdate = prepareProductUpdateData(
          validatedData,
          originalProduct,
          imageKeys
        );

        // If we have new images, delete the old ones first
        if (imageKeys?.length > 0) {
          await tx.productImage.deleteMany({
            where: { productId },
          });
        }

        // Update product
        await tx.product.update({
          where: { id: productId },
          data: dataToUpdate,
        });

        // -----------------------------------------
        // Create or update other product related tables.
        // -----------------------------------------
        // For `VariantOptionValue` usage
        const tempOptValToRealId: Record<string, number> = {};
        // Options
        await updateProductOptions(
          tx,
          productId,
          validatedData.options ?? [],
          tempOptValToRealId
        );
        // Variants + VariantOptionValue
        await updateProductVariants(
          tx,
          productId,
          validatedData.variants ?? [],
          tempOptValToRealId
        );
      });

      sendResponse(res, 200, {
        success: true,
        message: "Product updated successfully",
      });
    } catch (error) {
      handleError(error, res, true);
    }
  }
);

// Delete product
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const productId = parseInt(id);

  try {
    const prisma = await getPrisma();
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      sendResponse(res, 404, { success: false, message: "Product not found" });
      return;
    }

    if (product.is_demo === true) {
      sendResponse(res, 403, {
        success: false,
        message:
          "This is a default demo product and can't be deleted. Try adding your own and see how it works! 😉",
      });
      return;
    }

    await prisma.product.delete({ where: { id: productId } });
    sendResponse(res, 200, {
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    handleError(error, res, true);
  }
});

export default router;
