import express, { Router } from "express";
import categoriesController from "./categories.controller.js";

const router: Router = express.Router();

// Get all categories
router.get(
  "/",
  categoriesController.getAllCategories.bind(categoriesController)
);

// Get category by slug
router.get(
  "/:slug",
  categoriesController.getCategoryBySlug.bind(categoriesController)
);

export default router;
