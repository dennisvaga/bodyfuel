import { PrismaClient } from "@prisma/client";
import { getPlatformAwareUrl } from "@repo/platform-utils";

// Singleton holder
let prisma: PrismaClient | null = null;

/**
 * Returns a shared PrismaClient instance, initializing with PG adapter on server only.
 */
export async function getPrisma(): Promise<PrismaClient> {
  if (prisma) {
    return prisma;
  }

  // In browser, use default client without adapter
  if (typeof window !== "undefined") {
    prisma = new PrismaClient();
    return prisma;
  }

  // Server environment: initialize basic client
  let client = new PrismaClient();
  try {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("DATABASE_URL is not defined");
    } else {
      const url = getPlatformAwareUrl(connectionString);
      const adapter = new PrismaPg({ connectionString: url });
      client = new PrismaClient({ adapter });
      console.log("Prisma initialized with PG adapter");
    }
  } catch (error) {
    console.warn("Failed to load Prisma PG adapter:", error);
  }

  prisma = client;
  return prisma;
}
