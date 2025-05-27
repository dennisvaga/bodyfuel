import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cartRoutes from "./features/cart/cart.routes.js";
import categoriesRoutes from "./features/categories/categories.routes.js";
import collectionsRoutes from "./features/collections/collections.routes.js";
import countriesRoutes from "./features/countries/countries.routes.js";
import productsRoutes from "./features/products/products.routes.js";
import ordersRoutes from "./features/orders/orders.routes.js";
import authRoutes from "./features/auth/auth.routes.js";
import contactRoutes from "./features/contact/contact.routes.js"; // Contact route import
import adminRoutes from "./features/admin/admin.routes.js";

const app = express();
// Get allowed origins from environment variable or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001", "http://10.0.2.2:3000"];

console.log("CORS allowed origins:", allowedOrigins);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked request from unauthorized origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(morgan("dev"));
app.use(cookieParser());

// Public routes - accessible by both shop and admin
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/countries", countriesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes); // Added contact route usage

// Admin routes - secured by authenticatedAdmin middleware
app.use("/api/admin", adminRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
