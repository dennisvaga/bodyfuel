import { Request, Response } from "express";
import { normalizeFiles } from "#utils/utils.js";
import { parseProductBody, validateData, productSchema } from "@repo/shared";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";
import adminProductsService from "./admin.products.service.js";

/**
 * Admin products controller responsible for handling HTTP requests related to admin product management
 */
export class AdminProductsController {
  /**
   * Add a new product
   */
  async addProduct(req: Request, res: Response) {
    try {
      const body = parseProductBody(req.body);
      const images = normalizeFiles(req.files);
      const validatedData = validateData(productSchema, body);

      const result = await adminProductsService.addProduct(
        validatedData,
        images
      );

      sendResponse(res, 201, result);
    } catch (error) {
      handleError(error, res, true);
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      const body = parseProductBody(req.body);
      const images = normalizeFiles(req.files);
      const validatedData = validateData(productSchema, body);

      const result = await adminProductsService.updateProduct(
        productId,
        validatedData,
        images
      );

      sendResponse(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.message === "Product not found") {
        sendResponse(res, 404, {
          success: false,
          message: error.message,
        });
        return;
      }

      handleError(error, res, true);
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      const result = await adminProductsService.deleteProduct(productId);

      sendResponse(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.message === "Product not found") {
        sendResponse(res, 404, {
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message.includes("default demo product")
      ) {
        sendResponse(res, 403, {
          success: false,
          message: error.message,
        });
        return;
      }

      handleError(error, res, true);
    }
  }
}

export default new AdminProductsController();
