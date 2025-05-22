import express from "express";
// admin-specific route handlers
import adminProductsHandler from "./products.js";
import adminCollectionsHandler from "./collections.js";
import adminOrdersHandler from "./orders.js";
import { authenticatedAdmin } from "../../adminAuth.js";

const adminRouter = express.Router();

// Apply admin authentication to all routes in this router
adminRouter.use(authenticatedAdmin);

// Mount admin routes
adminRouter.use("/products", adminProductsHandler);
adminRouter.use("/collections", adminCollectionsHandler);
adminRouter.use("/orders", adminOrdersHandler);

export default adminRouter;
