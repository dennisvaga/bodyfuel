import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// Get the current file's path (ES module equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({
  path: resolve(__dirname, "../.env"),
});

console.log("NODE_ENV after loading:", process.env.NODE_ENV);

import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.js";
import categoriesRoutes from "./routes/categories.js";
import collectionsRoutes from "./routes/collections.js";
import countriesRoutes from "./routes/countries.js";
import productsRoutes from "./routes/products.js";
import ordersRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js"; // Added contact route import
import chatRoutes from "./features/chat/router.js"; // Updated chat route import
import adminRoutes from "./routes/admin/index.js";

const app = express();
// Get allowed origins from environment variable or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3001"];

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
app.use("/api/chat", chatRoutes); // Added chat route usage

// Admin routes - secured by authenticatedAdmin middleware
app.use("/api/admin", adminRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
