import { getPrisma } from "@repo/database";

// Re-export streaming utilities
export { streamProducts, streamTextChunks } from "./chat.utils";

/**
 * Find category by name
 *
 * @param name Category name
 * @returns Category ID or null if not found
 */
export async function findCategoryByName(name: string): Promise<number | null> {
  try {
    const prisma = await getPrisma();

    const category = await prisma.category.findFirst({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });

    return category ? category.id : null;
  } catch (error) {
    console.error("Error finding category by name:", error);
    return null;
  }
}
