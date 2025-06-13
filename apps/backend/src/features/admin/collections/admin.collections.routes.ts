import express, { Router } from "express";
import adminCollectionsController from "./admin.collections.controller.js";

const router: Router = express.Router();

// Add collection
router.post(
  "/",
  adminCollectionsController.addCollection.bind(adminCollectionsController)
);

// Edit collection
router.put(
  "/:id",
  adminCollectionsController.updateCollection.bind(adminCollectionsController)
);

// Delete collection
router.delete(
  "/:id",
  adminCollectionsController.deleteCollection.bind(adminCollectionsController)
);

export default router;
