import { categoryService } from "@repo/shared";
import { ChatbotSearchCriteria } from "../types/chatTypes";

/**
 * Extract search query from user message
 */
export function extractSearchQuery(userMessage: string): string {
  // Priority 1: Look for explicit search patterns
  const searchMatch = userMessage.match(
    /(?:find|search|looking for|show me|do you have|suggest|want|need)\s+(?:some|good|best)?\s*([^?.!]+)/i
  );

  if (searchMatch && searchMatch[1]) {
    return searchMatch[1].trim();
  }

  // Priority 2: Extract from question patterns
  const questionMatch = userMessage.match(
    /(?:what|which|any)\s+(?:kind\s+of\s+|types?\s+of\s+)?(.*?)(?:\s+do\s+you\s+have|\s+are\s+available|$)/i
  );

  if (questionMatch && questionMatch[1]) {
    return questionMatch[1].trim();
  }

  // Priority 3: Look for common product keywords
  const keywords = userMessage
    .toLowerCase()
    .match(
      /\b(?:protein|creatine|vitamin|supplement|bcaa|omega|collagen|pre workout|post workout)\b/g
    );

  if (keywords && keywords.length > 0) {
    return keywords[0].replace(/\s+/g, " ");
  }

  // Fallback: Use first few words
  return userMessage.split(" ").slice(0, 3).join(" ").trim() || "supplements";
}

/**
 * Extract price range from user message
 */
export function extractPriceRange(userMessage: string): {
  minPrice?: number;
  maxPrice?: number;
  targetPrice?: number;
} {
  const priceRange: {
    minPrice?: number;
    maxPrice?: number;
    targetPrice?: number;
  } = {};

  const betweenMatch =
    userMessage.match(
      /between\s+\$?(\d+)(?:\.(\d+))?\$?\s+(?:and|to|-)\s+\$?(\d+)(?:\.(\d+))?\$?/i
    ) ||
    userMessage.match(
      /between\s+\$?(\d+)(?:\.(\d+))?\$?-\$?(\d+)(?:\.(\d+))?\$?/i
    );

  if (betweenMatch) {
    const min = parseFloat(
      betweenMatch[1] + (betweenMatch[2] ? "." + betweenMatch[2] : "")
    );
    const max = parseFloat(
      betweenMatch[3] + (betweenMatch[4] ? "." + betweenMatch[4] : "")
    );
    priceRange.minPrice = Math.min(min, max);
    priceRange.maxPrice = Math.max(min, max);
    return priceRange;
  }

  const underMatch = userMessage.match(
    /(?:under|less than|below|cheaper than)\s+\$?(\d+)(?:\.(\d+))?\$?/i
  );
  if (underMatch) {
    priceRange.maxPrice = parseFloat(
      underMatch[1] + (underMatch[2] ? "." + underMatch[2] : "")
    );
    return priceRange;
  }

  const overMatch = userMessage.match(
    /(?:over|above|more than|higher than)\s+\$?(\d+)(?:\.(\d+))?\$?/i
  );
  if (overMatch) {
    priceRange.minPrice = parseFloat(
      overMatch[1] + (overMatch[2] ? "." + overMatch[2] : "")
    );
    return priceRange;
  }

  const aroundMatch = userMessage.match(
    /(?:around|about|approximately|roughly)\s+\$?(\d+)(?:\.(\d+))?\$?/i
  );
  if (aroundMatch) {
    const target = parseFloat(
      aroundMatch[1] + (aroundMatch[2] ? "." + aroundMatch[2] : "")
    );
    priceRange.targetPrice = target;
    const range = target * 0.2;
    priceRange.minPrice = Math.max(0, target - range);
    priceRange.maxPrice = target + range;
    return priceRange;
  }

  return priceRange;
}

/**
 * Extract category from message using shared categoryService
 */
async function extractCategoryFromMessage(
  message: string
): Promise<{ id: number; name: string } | null> {
  if (!message) return null;

  try {
    const categoriesResult = await categoryService.getCategoriesNames();
    if (!categoriesResult.success || !categoriesResult.data) {
      return null;
    }

    const categories = categoriesResult.data;
    const lowerMessage = message.toLowerCase();

    // Check for specific workout patterns first
    if (/pre.?workout|pre workout|preworkout/i.test(message)) {
      const preWorkout = categories.find(
        (cat) =>
          cat.name.toLowerCase().includes("pre") &&
          cat.name.toLowerCase().includes("workout")
      );
      if (preWorkout) return { id: preWorkout.id, name: preWorkout.name };
    }

    if (/post.?workout|post workout|postworkout/i.test(message)) {
      const postWorkout = categories.find(
        (cat) =>
          cat.name.toLowerCase().includes("post") &&
          cat.name.toLowerCase().includes("workout")
      );
      if (postWorkout) return { id: postWorkout.id, name: postWorkout.name };
    }

    // Check for weight loss patterns
    if (/\b(weight loss|fat loss|fat burn|diet)\b/i.test(message)) {
      const weightLoss = categories.find(
        (cat) =>
          cat.name.toLowerCase().includes("weight") ||
          cat.name.toLowerCase().includes("fat")
      );
      if (weightLoss) return { id: weightLoss.id, name: weightLoss.name };
    }

    // Extract words and try to match to categories
    const words = lowerMessage.replace(/[^\w\s-]/g, " ").split(/\s+/);

    for (const category of categories) {
      const categoryName = category.name.toLowerCase();

      // Direct name match
      if (lowerMessage.includes(categoryName)) {
        return { id: category.id, name: category.name };
      }

      // Word-based matching
      for (const word of words) {
        if (word.length >= 3 && categoryName.includes(word)) {
          return { id: category.id, name: category.name };
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error extracting category:", error);
    return null;
  }
}

/**
 * Parse chatbot query to extract search criteria
 */
export async function parseChatbotQuery(
  userMessage: string
): Promise<ChatbotSearchCriteria> {
  const searchQuery = extractSearchQuery(userMessage);
  const priceRange = extractPriceRange(userMessage);
  const category = await extractCategoryFromMessage(userMessage);

  return {
    query: searchQuery,
    ...priceRange,
    category: category?.name,
  };
}
