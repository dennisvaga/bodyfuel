import { PrismaClient } from "@prisma/client";

// Define prisma client without the PG adapter for client-side compatibility
let prisma: PrismaClient;

// Only use PG adapter on the server
if (typeof window === "undefined") {
  // Server-side code
  try {
    const { PrismaPg } = require("@prisma/adapter-pg");
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  } catch (e) {
    console.warn("Could not initialize Prisma with PG adapter:", e);
    prisma = new PrismaClient();
  }
} else {
  // Client-side code (browsers)
  prisma = new PrismaClient();
}

export { prisma };
