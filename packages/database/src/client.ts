import { PrismaClient } from "@prisma/client";
import { getPlatformAwareUrl } from "@repo/platform-utils";

// Singleton holder
let prisma: PrismaClient | null = null;

/**
 * Returns a shared PrismaClient instance, initializing with PG adapter on server only.
 */
export async function getPrisma(): Promise<PrismaClient> {
  // Return existing instance if available
  if (prisma) {
    return prisma;
  }

  // In browser, use default client without adapter
  if (typeof window !== "undefined") {
    prisma = new PrismaClient();
    return prisma;
  }

  // Check if we're in a context that should have DATABASE_URL
  const isBackend = !!process.env.DATABASE_URL;
  const isDev = process.env.NODE_ENV !== "production";

  // Server environment: initialize basic client
  let client = new PrismaClient();

  try {
    const connectionString = process.env.DATABASE_URL;

    // Only attempt to use PG adapter and warn about missing URL in backend contexts
    if (isBackend) {
      if (!connectionString) {
        if (isDev) {
          console.warn("DATABASE_URL is not defined in backend context");
        }
      } else {
        const { PrismaPg } = await import("@prisma/adapter-pg");
        const url = getPlatformAwareUrl(connectionString);
        const adapter = new PrismaPg({ connectionString: url });
        client = new PrismaClient({ adapter });

        if (isDev) {
          console.log("Prisma initialized with PG adapter");
        }
      }
    }
  } catch (error) {
    if (isBackend && isDev) {
      console.warn("Failed to load Prisma PG adapter:", error);
    }
  }

  prisma = client;
  return prisma;
}
