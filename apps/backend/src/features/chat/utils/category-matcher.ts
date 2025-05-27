import { getPrisma } from "@repo/database";

/**
 * Interface for category data with normalized search terms
 */
interface CategoryWithSearchTerms {
  id: number;
  name: string;
  slug: string;
  searchTerms: string[];
}

/**
 * Interface for product type variations
 */
interface ProductVariations {
  [key: string]: string[];
}

/**
 * Common product type variations
 * This maps base product types to their common variations
 */
const PRODUCT_VARIATIONS: ProductVariations = {
  vitamin: ["multivitamin", "vitamin d", "vitamin c", "vitamin b"],
  vitamins: ["multivitamin", "vitamin d", "vitamin c", "vitamin b"],
  protein: ["whey", "protein powder", "protein shake", "whey protein"],
  proteins: ["whey", "protein powder", "protein shake", "whey protein"],
  creatine: ["creatine monohydrate", "kre-alkalyn", "creatine hcl"],
  "pre-workout": ["pre workout", "preworkout"],
  "post-workout": ["post workout", "postworkout"],
  "weight loss": ["fat loss", "fat burner", "diet", "slimming", "thermogenic"],
  "fat loss": ["weight loss", "fat burner", "diet", "slimming", "thermogenic"],
};

/**
 * Get variations for a product type
 *
 * @param productType The base product type
 * @returns Array of variations for the product type
 */
export function getProductVariations(productType: string): string[] {
  const normalizedType = productType.toLowerCase().trim();
  return PRODUCT_VARIATIONS[normalizedType] || [];
}

/**
 * Expand search query with common variations
 *
 * @param searchQuery The original search query
 * @returns Array of expanded search queries
 */
export function expandSearchQuery(searchQuery: string): string[] {
  if (!searchQuery) return [];

  const normalizedQuery = searchQuery.toLowerCase().trim();
  let expandedQueries = [normalizedQuery];

  // Add singular/plural variations
  if (normalizedQuery.endsWith("s")) {
    expandedQueries.push(normalizedQuery.slice(0, -1)); // Remove 's' for singular
  } else {
    expandedQueries.push(normalizedQuery + "s"); // Add 's' for plural
  }

  // Add product variations if available
  const variations = getProductVariations(normalizedQuery);
  if (variations.length > 0) {
    expandedQueries = [...expandedQueries, ...variations];
  }

  return expandedQueries;
}

/**
 * Cache for categories with their search terms
 */
let categoriesCache: CategoryWithSearchTerms[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all categories and prepare search terms
 */
export async function getCategoriesWithSearchTerms(): Promise<
  CategoryWithSearchTerms[]
> {
  const now = Date.now();

  // Return cached categories if they exist and are not expired
  if (categoriesCache && now - lastFetchTime < CACHE_TTL) {
    return categoriesCache;
  }

  try {
    // Fetch categories from database
    const prisma = await getPrisma();
    const categories = await prisma.category.findMany();

    // Process categories and create search terms
    categoriesCache = categories.map((category: any) => {
      const name = category.name.toLowerCase();
      const slug = category.slug.toLowerCase();
      const searchTerms = generateSearchTerms(name, slug);

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        searchTerms,
      };
    });

    // Add special case mappings
    addSpecialCaseMappings(categoriesCache);

    // Update last fetch time
    lastFetchTime = now;

    return categoriesCache;
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return empty array if there's an error
    return [];
  }
}

/**
 * Generate search terms for a category
 */
function generateSearchTerms(name: string, slug: string): string[] {
  const searchTerms = new Set<string>();

  // Add name and slug
  searchTerms.add(name);
  searchTerms.add(slug);

  // Add singular/plural variations
  if (name.endsWith("s")) {
    searchTerms.add(name.slice(0, -1));
  } else {
    searchTerms.add(name + "s");
  }

  // Add versions with and without hyphens
  if (name.includes("-")) {
    searchTerms.add(name.replace(/-/g, " "));
  } else if (name.includes(" ")) {
    searchTerms.add(name.replace(/ /g, "-"));
  }

  // Add versions with and without hyphens for slug
  if (slug.includes("-")) {
    searchTerms.add(slug.replace(/-/g, " "));
  } else if (slug.includes(" ")) {
    searchTerms.add(slug.replace(/ /g, "-"));
  }

  return Array.from(searchTerms);
}

/**
 * Add special case mappings for certain categories
 */
function addSpecialCaseMappings(categories: CategoryWithSearchTerms[]): void {
  // Find categories by name
  const weightLossCategory = categories.find(
    (c) => c.name.toLowerCase() === "weight loss"
  );
  const preWorkoutCategory = categories.find(
    (c) => c.name.toLowerCase() === "pre-workout"
  );
  const postWorkoutCategory = categories.find(
    (c) => c.name.toLowerCase() === "post-workout"
  );

  // Add special terms for weight loss
  if (weightLossCategory) {
    weightLossCategory.searchTerms.push(
      "fat loss",
      "fat burner",
      "diet",
      "slimming"
    );
  }

  // Add special terms for pre-workout
  if (preWorkoutCategory) {
    preWorkoutCategory.searchTerms.push("pre workout", "preworkout", "pre");
  }

  // Add special terms for post-workout
  if (postWorkoutCategory) {
    postWorkoutCategory.searchTerms.push("post workout", "postworkout", "post");
  }
}

/**
 * Find category by search term
 */
export async function findCategoryBySearchTerm(
  searchTerm: string
): Promise<{ id: number; name: string } | null> {
  if (!searchTerm) return null;

  const normalizedTerm = searchTerm.toLowerCase().trim();
  const categories = await getCategoriesWithSearchTerms();

  // First try exact match
  for (const category of categories) {
    if (category.searchTerms.includes(normalizedTerm)) {
      return { id: category.id, name: category.name };
    }
  }

  // Then try partial match
  for (const category of categories) {
    for (const term of category.searchTerms) {
      if (term.includes(normalizedTerm) || normalizedTerm.includes(term)) {
        return { id: category.id, name: category.name };
      }
    }
  }

  return null;
}

/**
 * Extract category from user message
 */
export async function extractCategoryFromMessage(
  message: string
): Promise<{ id: number; name: string } | null> {
  if (!message) return null;

  // Check for pre-workout and post-workout specifically
  const preWorkoutMatch = message
    .toLowerCase()
    .match(/pre.?workout|pre workout|preworkout/i);
  if (preWorkoutMatch) {
    return findCategoryBySearchTerm("pre-workout");
  }

  const postWorkoutMatch = message
    .toLowerCase()
    .match(/post.?workout|post workout|postworkout/i);
  if (postWorkoutMatch) {
    return findCategoryBySearchTerm("post-workout");
  }

  // Check for weight loss specifically
  if (/\b(weight loss|fat loss|fat burn|diet)\b/i.test(message)) {
    return findCategoryBySearchTerm("weight loss");
  }

  // Extract words from message
  const words = message
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/);

  // Try to match each word to a category
  for (const word of words) {
    if (word.length < 3) continue; // Skip very short words

    const category = await findCategoryBySearchTerm(word);
    if (category) {
      return category;
    }
  }

  // Try to match phrases (2-3 words)
  for (let i = 0; i < words.length - 1; i++) {
    const twoWordPhrase = words[i] + " " + words[i + 1];
    const category = await findCategoryBySearchTerm(twoWordPhrase);
    if (category) {
      return category;
    }

    if (i < words.length - 2) {
      const threeWordPhrase = twoWordPhrase + " " + words[i + 2];
      const category = await findCategoryBySearchTerm(threeWordPhrase);
      if (category) {
        return category;
      }
    }
  }

  return null;
}
