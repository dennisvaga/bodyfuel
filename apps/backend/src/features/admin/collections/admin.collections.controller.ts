import { Request, Response } from "express";
import { validateData, CollectionSchema } from "@repo/shared";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";
import adminCollectionsService from "./admin.collections.service.js";

/**
 * Admin collections controller responsible for handling HTTP requests related to admin collection management
 */
export class AdminCollectionsController {
  /**
   * Add a new collection
   */
  async addCollection(req: Request, res: Response) {
    try {
      const collectionData = req.body;
      const validatedData = validateData(CollectionSchema, collectionData);

      const result = await adminCollectionsService.addCollection(validatedData);

      sendResponse(res, 201, result);
    } catch (error) {
      handleError(error, res, true);
    }
  }

  /**
   * Update an existing collection
   */
  async updateCollection(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const collectionId = parseInt(id);

      const rawCollectionInput = req.body;
      const validatedCollectionInput = validateData(
        CollectionSchema,
        rawCollectionInput
      );

      const result = await adminCollectionsService.updateCollection(
        collectionId,
        validatedCollectionInput
      );

      sendResponse(res, 201, result);
    } catch (error) {
      if (error instanceof Error && error.message === "Collection not found") {
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
   * Delete a collection
   */
  async deleteCollection(req: Request<{ id: string }>, res: Response) {
    try {
      const { id } = req.params;
      const collectionId = parseInt(id);

      const result =
        await adminCollectionsService.deleteCollection(collectionId);

      sendResponse(res, 200, result);
    } catch (error) {
      if (error instanceof Error && error.message === "Collection not found") {
        sendResponse(res, 404, {
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message.includes("default demo collection")
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

export default new AdminCollectionsController();
