import express, { Router } from "express";
import { getPrisma } from "@repo/database";

const router: Router = express.Router();

// Test database connection
router.get("/db-connection", async (req, res) => {
  try {
    const prisma = await getPrisma();

    // Simple query to test connection
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();

    res.json({
      success: true,
      message: "Database connection successful",
      data: {
        userCount,
        categoryCount,
        databaseUrl: process.env.DATABASE_URL ? "Set" : "Not set",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Test if admin user exists
router.get("/check-admin", async (req, res) => {
  try {
    const prisma = await getPrisma();

    // Check for admin users
    const adminUsers = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({
      success: true,
      message: "Admin user check completed",
      data: {
        adminCount: adminUsers.length,
        admins: adminUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check admin users",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
