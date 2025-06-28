import { ChatbotSearchCriteria } from "@repo/shared";
import { extractCategoryFromMessage } from "./category-matcher.js";
import {
  PRICE_PATTERNS,
  SEARCH_PATTERNS,
  CATEGORY_TERMS,
  PRODUCT_QUERY_PATTERN,
  FALLBACK_TERMS,
} from "../config/query-patterns.js";

/**
 * Extract search query from user message
 *
 * @param userMessage The user's message content
 * @returns The extracted search query
 */
export async function extractSearchQuery(userMessage: string): Promise<string> {
  // Extract search terms and price range from the user message
  const searchTermsMatch = userMessage.match(SEARCH_PATTERNS.SEARCH_TERMS);

  // Check for price-related queries first
  // Match both "between X and Y" and "between X-Y" formats
  const priceRangeMatch =
    userMessage.match(PRICE_PATTERNS.RANGE[0]) ||
    userMessage.match(PRICE_PATTERNS.RANGE[1]);
  const underPriceMatch = userMessage.match(PRICE_PATTERNS.UNDER);
  const overPriceMatch = userMessage.match(PRICE_PATTERNS.OVER);

  let searchQuery = "";

  if (priceRangeMatch || underPriceMatch || overPriceMatch) {
    console.log("Price match detected!");
    console.log("priceRangeMatch:", priceRangeMatch);
    console.log("underPriceMatch:", underPriceMatch);
    console.log("overPriceMatch:", overPriceMatch);

    // For price range queries, extract product type if mentioned
    // Look for category terms in the message
    const categoryTerms = userMessage
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/);

    console.log("Category terms extracted from message:", categoryTerms);
    console.log("Available CATEGORY_TERMS:", CATEGORY_TERMS);

    // Check if any of the words match common category terms
    const categoryMatch = categoryTerms.find((term) =>
      CATEGORY_TERMS.some((categoryTerm) => {
        const matches = term.toLowerCase().includes(categoryTerm.toLowerCase());
        console.log(
          `  Checking "${term}" includes "${categoryTerm}": ${matches}`
        );
        return matches;
      })
    );

    console.log("Category match found:", categoryMatch);

    // Special handling for pre-workout and post-workout
    const preWorkoutMatch = userMessage
      .toLowerCase()
      .match(SEARCH_PATTERNS.PRE_WORKOUT);
    const postWorkoutMatch = userMessage
      .toLowerCase()
      .match(SEARCH_PATTERNS.POST_WORKOUT);

    if (preWorkoutMatch) {
      searchQuery = "pre-workout";
    } else if (postWorkoutMatch) {
      searchQuery = "post-workout";
    } else if (categoryMatch) {
      searchQuery = categoryMatch;
    } else {
      // If no specific category term, check for product terms
      if (/\b(product|products)\b/i.test(userMessage)) {
        // If it's a generic product query with a price range, use fallback term
        // This ensures we have a search term for price-based queries
        searchQuery = FALLBACK_TERMS.DEFAULT_SUPPLEMENT;
      } else {
        // If no specific product type, use a generic search
        searchQuery = FALLBACK_TERMS.GENERIC_PRODUCT;
      }
    }
  } else if (searchTermsMatch && searchTermsMatch[1]) {
    searchQuery = searchTermsMatch[1].trim();
  } else {
    // Use the category matcher utilities to extract category from message
    const extractedCategory = await extractCategoryFromMessage(userMessage);

    if (extractedCategory) {
      searchQuery = extractedCategory.name.toLowerCase();
    } else {
      // If no specific pattern matched, extract keywords from the message
      const keywords = userMessage.match(SEARCH_PATTERNS.PRODUCT_KEYWORDS);
      if (keywords && keywords.length > 0) {
        searchQuery = keywords[0];
      } else {
        // Check for simple product queries like "give me vitamins"
        const simpleProductMatch = userMessage.match(
          SEARCH_PATTERNS.SIMPLE_PRODUCT
        );
        if (simpleProductMatch) {
          searchQuery = simpleProductMatch[1];
        } else {
          // Last resort: use the cleaned message as the search query
          searchQuery = userMessage.replace(/[^\w\s]/g, "").trim();
        }
      }
    }
  }

  return searchQuery;
}

/**
 * Extract price range from user message
 *
 * @param userMessage The user's message content
 * @returns Object containing minPrice, maxPrice, and targetPrice
 */
export function extractPriceRange(userMessage: string): {
  minPrice?: number;
  maxPrice?: number;
  targetPrice?: number;
} {
  let targetPrice: number | undefined;
  let minPrice: number | undefined;
  let maxPrice: number | undefined;

  // Extract price information if available
  // Match both "between X and Y" and "between X-Y" formats
  const priceRangeMatch =
    userMessage.match(PRICE_PATTERNS.RANGE[0]) ||
    userMessage.match(PRICE_PATTERNS.RANGE[1]);
  const underPriceMatch = userMessage.match(PRICE_PATTERNS.UNDER);
  const overPriceMatch = userMessage.match(PRICE_PATTERNS.OVER);
  const priceMatch = userMessage.match(PRICE_PATTERNS.EXACT);

  if (priceRangeMatch) {
    // Handle "between X and Y" price range
    const minPriceStr =
      priceRangeMatch[1] + (priceRangeMatch[2] ? "." + priceRangeMatch[2] : "");
    const maxPriceStr =
      priceRangeMatch[3] + (priceRangeMatch[4] ? "." + priceRangeMatch[4] : "");
    minPrice = parseFloat(minPriceStr);
    maxPrice = parseFloat(maxPriceStr);
  } else if (underPriceMatch) {
    // Handle "under X" price
    const priceCeiling =
      underPriceMatch[1] + (underPriceMatch[2] ? "." + underPriceMatch[2] : "");
    maxPrice = parseFloat(priceCeiling);
    minPrice = 0; // Start from 0
  } else if (overPriceMatch) {
    // Handle "over X" price
    const priceFloor =
      overPriceMatch[1] + (overPriceMatch[2] ? "." + overPriceMatch[2] : "");
    minPrice = parseFloat(priceFloor);
    maxPrice = 10000; // Set a high upper limit
  } else if (priceMatch) {
    // Handle exact price with some flexibility
    targetPrice = parseFloat(
      priceMatch[1] + (priceMatch[2] ? "." + priceMatch[2] : "")
    );
    // Set a price range around the target price (±20%)
    minPrice = targetPrice * 0.8;
    maxPrice = targetPrice * 1.2;
  }

  return { minPrice, maxPrice, targetPrice };
}

/**
 * Check if a message is a product query
 *
 * @param message The message content to check
 * @returns True if the message is a product query, false otherwise
 */
export function isProductQuery(message: string): boolean {
  return PRODUCT_QUERY_PATTERN.test(message);
}

/**
 * Parse a chatbot query into search criteria
 *
 * @param userMessage The user's message
 * @returns Promise with the parsed search criteria
 */
export async function parseChatbotQuery(
  userMessage: string
): Promise<ChatbotSearchCriteria> {
  console.log("\n=== PARSING CHATBOT QUERY ===");
  console.log("User message:", userMessage);

  const searchQuery = await extractSearchQuery(userMessage);
  console.log("Extracted search query:", searchQuery);

  const { minPrice, maxPrice, targetPrice } = extractPriceRange(userMessage);
  console.log("Extracted price range:", { minPrice, maxPrice, targetPrice });

  // Extract category if possible
  let categoryId: number | undefined = undefined;
  const category = await extractCategoryFromMessage(userMessage);
  if (category) {
    categoryId = category.id;
    console.log("Extracted category:", category.name, "ID:", categoryId);
  } else {
    console.log("No category extracted");
  }

  const result = {
    searchQuery,
    minPrice,
    maxPrice,
    targetPrice,
    categoryId,
  };

  console.log("Final search criteria:", JSON.stringify(result, null, 2));
  console.log("=== END PARSING ===\n");

  return result;
}
