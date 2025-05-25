import { PrismaClient } from "@prisma/client";
import { convertLocalhostUrl } from "@platform-utils";

// Create a default instance
let prisma = new PrismaClient();

// Function to initialize Prisma with PG adapter
async function initPrismaWithPgAdapter() {
  if (typeof window === "undefined") {
    try {
      const { PrismaPg } = await import("@prisma/adapter-pg");
      let connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        console.warn("No DATABASE_URL provided for PG adapter");
        return prisma;
      }

      // Use the platform-utils package to get the correct URL for Android
      connectionString = convertLocalhostUrl(connectionString);

      const adapter = new PrismaPg({ connectionString });
      prisma = new PrismaClient({ adapter });
      console.log("Prisma initialized with PG adapter");
    } catch (e) {
      console.warn("Could not initialize Prisma with PG adapter:", e);
    }
  }
  return prisma;
}

// Start the initialization process
initPrismaWithPgAdapter().catch((e) => {
  console.error("Failed to initialize Prisma:", e);
});

// Export the pre-initialized instance
export { prisma };
