import express, { Router } from "express";
import collectionsController from "./collections.controller.js";

const router: Router = express.Router();

// Get all collections
router.get(
  "/",
  collectionsController.getAllCollections.bind(collectionsController)
);

// Get collection by slug with paginated products
router.get(
  "/:slug",
  collectionsController.getCollectionBySlug.bind(collectionsController)
);

export default router;
