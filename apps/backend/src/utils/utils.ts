export function slugifyNative(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove consecutive dashes
}

export function normalizeFiles(
  data: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined
): Express.Multer.File[] {
  if (!data) return []; // Handle undefined case safely

  if (Array.isArray(data)) {
    return data; // Already an array, return as is
  }

  if (typeof data === "object") {
    return Object.values(data).flat(); // Flatten object values into a single array
  }

  return []; // Default empty array
}
