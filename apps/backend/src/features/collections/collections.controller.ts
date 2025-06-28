import { Request, Response } from "express";
import collectionsService from "./collections.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";
import { parsePaginationParams } from "#utils/pagination-utils.js";

/**
 * Collections controller responsible for handling HTTP requests related to collections
 */
export class CollectionsController {
  /**
   * Get all collections
   */
  async getAllCollections(req: Request, res: Response) {
    try {
      const includeProducts = req.query.includeProducts === "true";
      const usePagination = req.query.paginate === "true";
      const { currentPage, itemsPerPage } = parsePaginationParams(req.query);

      const result = await collectionsService.getAllCollections(
        includeProducts,
        usePagination,
        currentPage,
        itemsPerPage
      );

      if (usePagination) {
        sendResponse(res, 200, {
          success: true,
          data: result.collections,
          pagination: result.pagination,
        });
      } else {
        sendResponse(res, 200, {
          success: true,
          data: result.collections,
        });
      }
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get collection by slug with paginated products
   */
  async getCollectionBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const { currentPage, itemsPerPage } = parsePaginationParams(req.query);

      const { collection, pagination } =
        await collectionsService.getCollectionBySlugWithPaginatedProducts(
          slug,
          currentPage,
          itemsPerPage
        );

      sendResponse(res, 200, {
        success: true,
        data: collection,
        pagination,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new CollectionsController();
