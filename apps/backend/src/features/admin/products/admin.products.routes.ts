import express, { Router } from "express";
import multer from "multer";
import adminProductsController from "./admin.products.controller.js";

const router: Router = express.Router();
const upload = multer(); // In-memory storage

// Add product
router.post(
  "/",
  upload.any(),
  adminProductsController.addProduct.bind(adminProductsController)
);

// Edit product
router.put(
  "/:id",
  upload.any(),
  adminProductsController.updateProduct.bind(adminProductsController)
);

// Delete product
router.delete(
  "/:id",
  adminProductsController.deleteProduct.bind(adminProductsController)
);

export default router;
