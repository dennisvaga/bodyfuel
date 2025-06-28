import { Request, Response } from "express";
import productService from "./products.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";
import { parsePaginationParams } from "#utils/pagination-utils.js";

/**
 * Product controller responsible for handling HTTP requests related to products
 */
export class ProductController {
  /**
   * Search products
   */
  async searchProducts(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const products = await productService.searchProducts(
        search as string | undefined
      );

      sendResponse(res, 200, {
        success: true,
        data: products,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get all products with optional pagination
   */
  async getProducts(req: Request, res: Response) {
    const getAllProducts = req.query.getAllProducts === "true";

    try {
      if (getAllProducts) {
        const products = await productService.getAllProducts();

        sendResponse(res, 200, {
          success: true,
          data: products,
        });
        return;
      }

      // Use pagination
      const { currentPage, itemsPerPage } = parsePaginationParams(req.query);
      const { products, pagination } =
        await productService.getPaginatedProducts(currentPage, itemsPerPage);

      sendResponse(res, 200, {
        success: true,
        data: products,
        pagination,
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    try {
      const product = await productService.getProductBySlug(slug);

      sendResponse(res, 200, {
        success: true,
        data: product,
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new ProductController();
