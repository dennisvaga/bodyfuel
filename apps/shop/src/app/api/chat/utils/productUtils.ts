import type { ProductWithImageUrl } from "@repo/database/types/product";
import { productService, categoryService } from "@repo/shared";
import { ChatbotSearchCriteria, StreamProductResponse } from "../types/chatTypes";

/**
 * Extract search query from user message - simplified version
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
 * Simple category extraction using shared categoryService
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

/**
 * Search products for chat using the shared productService
 */
export async function searchProductsForChat(
  criteria: ChatbotSearchCriteria
): Promise<ProductWithImageUrl[]> {
  try {
    // Use the existing productService for basic search
    const result = await productService.searchProducts(criteria.query);

    if (!result.success || !result.data) {
      return [];
    }

    // Apply chat-specific filtering (price range, category, etc.)
    return filterProductsForChat(result.data, criteria);
  } catch (error) {
    console.error("Error searching products for chat:", error);
    return [];
  }
}

/**
 * Filter products based on chat criteria
 */
function filterProductsForChat(
  products: ProductWithImageUrl[],
  criteria: ChatbotSearchCriteria
): ProductWithImageUrl[] {
  let filtered = products;

  // Apply price filtering
  if (criteria.minPrice || criteria.maxPrice) {
    filtered = filtered.filter((product) => {
      const price = product.price;
      return (
        (!criteria.minPrice || price >= criteria.minPrice) &&
        (!criteria.maxPrice || price <= criteria.maxPrice)
      );
    });
  }

  return filtered.slice(0, 5); // Limit for chat
}

/**
 * Format products for AI context
 */
export function formatProductsForAI(products: ProductWithImageUrl[]): string {
  if (!products || products.length === 0) {
    return "No products found matching the criteria.";
  }

  return products
    .map((product, index) => {
      return `${index + 1}. ${product.name} - $${product.price} - ${product.description || "No description available"}`;
    })
    .join("\n");
}

/**
 * Create product HTML for streaming
 */
export function createProductHtml(products: ProductWithImageUrl[]): string {
  if (!products || products.length === 0) {
    return "";
  }

  return products
    .map((product) => {
      const imageUrl = product.images?.[0]?.imageUrl || "/media/blankImage.jpg";
      return `<div class="product-card" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${imageUrl}" data-slug="${product.slug}"></div>`;
    })
    .join("");
}

/**
 * Create system message for AI
 */
export function createSystemMessage(
  productInfo: string = "",
  productHtml: string = ""
): string {
  let systemMessage = `You are BodyFuel's assistant. Be concise and helpful about fitness products.`;

  const commonInstructions = `
1. NEVER include phrases like "I need details from our database" or "I'll need information from our product catalog" or similar statements that reveal your dependency on a database.
2. NEVER mention database limitations, product data access, or any other system constraints to users.
3. Respond naturally as if you're a human assistant who works at BodyFuel and is familiar with the product catalog.
4. Use emojis in your responses to make your tone friendly and engaging (e.g., 💪, 🏋️‍♀️, 🥗, 🏃‍♂️, 🧠).
5. Use Markdown formatting for emphasis, especially **bold text** for important points and product categories.
6. Keep your tone warm, enthusiastic, and conversational - like a knowledgeable fitness friend.
7. For your first message to users, simply greet them with: "Hi! How can I help you find fitness products today? 💪"
8. CRITICAL: Keep formatting very compact - use minimal whitespace and newlines. DO NOT add extra blank lines between paragraphs or list items.
9. For lists, use simple dash (-) or asterisk (*) notation, not numbered lists, and don't add extra newlines between list items.
10. NEVER leave blank lines between list items or sections of your response.`;

  if (productInfo) {
    systemMessage += `\n\nProduct information (for your reference only, DO NOT list these products in text form):\n${productInfo}`;
  }

  if (productHtml) {
    systemMessage += `\n\nIMPORTANT: Include this EXACT HTML in your response:\n${productHtml}\nDO NOT modify this HTML.`;
    systemMessage += `\n\nCRITICAL INSTRUCTIONS (YOU MUST FOLLOW THESE EXACTLY):
1. ONLY suggest products that are in the database and returned in the product data above.
2. NEVER suggest products that aren't in the provided product data.
3. NEVER output HTML directly in your text response - the product cards will be rendered automatically.
4. DO NOT list products in text form - the cards already display all necessary information.
5. You can introduce products with a brief sentence like "Here are some products that might interest you:" but DO NOT describe each product again.
6. If no products are found, simply state that no products matching the criteria were found.
7. DO NOT use your general knowledge about vitamins, supplements, or fitness products - ONLY use the specific products provided in the product data.
8. For queries about vitamins, protein, or any other product category, ONLY show the products from the database, not generic information.${commonInstructions}`;
  } else {
    systemMessage += `\n\nCRITICAL INSTRUCTIONS:
1. Do NOT suggest specific products unless they are provided to you in product data.
2. If asked about products (like vitamins, protein, etc.) and no product data is provided, tell the user: "I don't see any products matching that specific criteria. Could you try searching for something more general like 'protein powders' or 'vitamins'? 💪"
3. NEVER make up or invent product categories, brands, or types that don't exist in the provided data.
4. NEVER suggest high-end, luxury, premium, or concierge categories when no products are found - stick to real products only.
5. When no products are found, simply suggest trying different search terms without elaborating on fictional product categories.
6. If no products are found, keep your response brief and never suggest imaginary product categories or features.
7. Keep your responses compact with minimal whitespace - no extra blank lines between paragraphs or list items.
8. DO NOT provide generic lists of product types from your general knowledge.
9. DO NOT output HTML in your responses.${commonInstructions}`;
  }

  return systemMessage;
}
