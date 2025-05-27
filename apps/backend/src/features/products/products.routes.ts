import express, { Router } from "express";
import productController from "./products.controller.js";

const router: Router = express.Router();

// Search products without pagination
router.get("/search", productController.searchProducts.bind(productController));

// Get products with pagination
router.get("/", productController.getProducts.bind(productController));

// Get product by slug
router.get(
  "/:slug",
  productController.getProductBySlug.bind(productController)
);

export default router;
