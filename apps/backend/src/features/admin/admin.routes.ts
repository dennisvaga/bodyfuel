import express, { Router } from "express";
// admin-specific route handlers
import adminProductsRoutes from "./products/admin.products.routes.js";
import adminCollectionsRoutes from "./collections/admin.collections.routes.js";
import adminOrdersRoutes from "./orders/admin.orders.routes.js";
import { authenticatedAdmin } from "#middleware/admin-auth.js";

const adminRouter: Router = express.Router();

// Apply admin authentication to all routes in this router
adminRouter.use(authenticatedAdmin);

// Mount admin routes
adminRouter.use("/products", adminProductsRoutes);
adminRouter.use("/collections", adminCollectionsRoutes);
adminRouter.use("/orders", adminOrdersRoutes);

export default adminRouter;
