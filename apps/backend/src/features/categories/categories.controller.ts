import { Request, Response } from "express";
import categoriesService from "./categories.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Categories controller responsible for handling HTTP requests related to categories
 */
export class CategoriesController {
  /**
   * Get all categories
   */
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await categoriesService.getAllCategories();

      sendResponse(res, 200, { success: true, data: categories });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const category = await categoriesService.getCategoryBySlug(slug);

      sendResponse(res, 200, { success: true, data: category });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new CategoriesController();
