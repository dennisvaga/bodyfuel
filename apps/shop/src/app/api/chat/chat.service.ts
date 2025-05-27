import type { ProductWithImageUrl } from "@repo/database/types/product";
import { productService } from "@repo/shared";
import {
  ChatbotSearchCriteria,
  ChatMessage,
  AIMessageFormat,
  StreamProductResponse,
} from "./chat.types.js";
import { extractCategoryFromMessage, buildWhereClause } from "./chat.utils";
import { streamProducts } from "./chat.repository.js";
import { DataStreamWriter } from "ai";

/**
 * Extract search query from user message
 */
export async function extractSearchQuery(userMessage: string): Promise<string> {
  const searchTermsMatch = userMessage.match(
    /(?:find|search|looking for|show me|do you have|suggest|get|want|give me|send me)\s+(?:some|good|best)?\s+(.*?)(?:\s+(?:for|in\s+range\s+of|around|about)\s+(\d+)(?:\.(\d+))?\s+dollars)?/i
  );

  const priceRangeMatch =
    userMessage.match(
      /between\s+\$?(\d+)(?:\.(\d+))?\$?\s+(?:and|to|-)\s+\$?(\d+)(?:\.(\d+))?\$?/i
    ) ||
    userMessage.match(
      /between\s+\$?(\d+)(?:\.(\d+))?\$?-\$?(\d+)(?:\.(\d+))?\$?/i
    );
  const underPriceMatch = userMessage.match(
    /(?:under|less than|below|cheaper than)\s+\$?(\d+)(?:\.(\d+))?\$?/i
  );
  const overPriceMatch = userMessage.match(
    /(?:over|above|more than|higher than)\s+\$?(\d+)(?:\.(\d+))?\$?/i
  );

  let searchQuery = "";

  if (priceRangeMatch || underPriceMatch || overPriceMatch) {
    const categoryTerms = userMessage
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/);

    const categoryMatch = categoryTerms.find((term) =>
      /weight|loss|fat|burn|diet|vitamin|protein|creatine|pre|post|workout|supplement|bcaa|omega|fish oil|amino|collagen/i.test(
        term
      )
    );

    if (categoryMatch) {
      searchQuery = categoryMatch;
    } else {
      searchQuery = "supplements";
    }
  } else if (searchTermsMatch && searchTermsMatch[1]) {
    searchQuery = searchTermsMatch[1].trim();
  } else {
    const patterns = [
      /(?:what|which|any)\s+(?:kind\s+of\s+|types?\s+of\s+)?(.*?)(?:\s+do\s+you\s+have|\s+are\s+available|$)/i,
      /(?:I\s+need|looking\s+for|want|searching\s+for)\s+(.*?)(?:\s+supplements?|\s+products?|$)/i,
    ];

    for (const pattern of patterns) {
      const match = userMessage.match(pattern);
      if (match && match[1] && match[1].trim()) {
        searchQuery = match[1].trim();
        break;
      }
    }

    if (!searchQuery) {
      const keywords = userMessage
        .toLowerCase()
        .match(
          /\b(?:protein|creatine|vitamin|bcaa|omega|fish\s*oil|collagen|pre\s*workout|post\s*workout)\b/g
        );

      if (keywords && keywords.length > 0) {
        searchQuery = keywords[0].replace(/\s+/g, " ");
      }
    }
  }

  return searchQuery || "supplements";
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
 * Parse chatbot query to extract search criteria
 */
export async function parseChatbotQuery(
  userMessage: string
): Promise<ChatbotSearchCriteria> {
  const searchQuery = await extractSearchQuery(userMessage);
  const priceRange = extractPriceRange(userMessage);

  const category = await extractCategoryFromMessage(userMessage);

  return {
    query: searchQuery,
    searchQuery, // Keep as alias for backward compatibility
    ...priceRange,
    categoryId: category?.id,
  };
}

/**
 * Check if message is about products
 */
export function isProductQuery(message: string): boolean {
  const productKeywords = [
    "product",
    "supplement",
    "vitamin",
    "protein",
    "creatine",
    "bcaa",
    "omega",
    "fish oil",
    "collagen",
    "pre workout",
    "post workout",
    "find",
    "search",
    "looking for",
    "show me",
    "do you have",
    "suggest",
    "recommend",
    "need",
    "want",
    "buy",
    "purchase",
  ];

  const lowerMessage = message.toLowerCase();
  return productKeywords.some((keyword) => lowerMessage.includes(keyword));
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

  // Apply category filtering
  if (criteria.categoryId) {
    filtered = filtered.filter(
      (product) => product.categoryId === criteria.categoryId
    );
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
 * Format conversation messages for AI
 */
export function formatMessagesForAI(
  messages: ChatMessage[]
): AIMessageFormat[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role as AIMessageFormat["role"],
    content: msg.content,
  }));
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

/**
 * Stream products based on search criteria
 */
export async function* streamProductSearch(
  userMessage: string,
  searchCriteria: ChatbotSearchCriteria
): AsyncGenerator<StreamProductResponse, void, unknown> {
  try {
    // Search for products
    const products = await searchProductsForChat(searchCriteria);

    let allProductInfo = "";
    let allProductHtml = "";

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productCount = i + 1;

      // Format product info for AI
      const productInfo = `${productCount}. ${product.name} - $${product.price} - ${product.description || "No description available"}`;
      allProductInfo += (allProductInfo ? "\n" : "") + productInfo;

      // Create product HTML
      const imageUrl = product.images?.[0]?.imageUrl || "/media/blankImage.jpg";
      const productHtml = `<div class="product-card" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${imageUrl}" data-slug="${product.slug}"></div>`;
      allProductHtml += productHtml;

      yield {
        productInfo: allProductInfo,
        productHtml: allProductHtml,
        productCount,
        hasMore: i < products.length - 1,
        isStreaming: true,
      };
    }

    // Yield final response if we have products
    if (products.length > 0) {
      yield {
        productInfo: allProductInfo,
        productHtml: allProductHtml,
        productCount: products.length,
        hasMore: false,
        isStreaming: false,
      };
    }
  } catch (error) {
    console.error("Error streaming products:", error);
    throw error;
  }
}

/**
 * Create a simple response message
 */
export function createSimpleResponseMessage(productCount: number): string {
  return `Here are the top ${Math.min(productCount, 5)} products matching your search.`;
}

/**
 * Create a no products found message
 */
export function createNoProductsMessage(): string {
  return "I don't see any products matching that query. Let me help you find something else.";
}

/**
 * Main function to process user message and return streaming response
 */
export async function processUserMessage(
  userMessage: ChatMessage,
  conversationId?: string
): Promise<ReadableStream> {
  try {
    // Check if this is a product-related query
    if (isProductQuery(userMessage.content)) {
      // Parse the query to extract search criteria
      const criteria = await parseChatbotQuery(userMessage.content);

      // Create ReadableStream from the async generator
      const encoder = new TextEncoder();
      return new ReadableStream({
        async start(controller) {
          try {
            const productGenerator = streamProductSearch(
              userMessage.content,
              criteria
            );

            for await (const response of productGenerator) {
              // Send the response data
              const chunk = JSON.stringify(response) + "\n";
              controller.enqueue(encoder.encode(chunk));
            }

            controller.close();
          } catch (error) {
            console.error("Stream error:", error);
            controller.error(error);
          }
        },
      });
    } else {
      // For non-product queries, return a helpful message
      const response =
        "I'm here to help you find health and nutrition products. Try asking me about supplements, vitamins, proteins, or any specific product you're looking for!";

      // Create a simple readable stream
      const encoder = new TextEncoder();
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(response));
          controller.close();
        },
      });
    }
  } catch (error) {
    console.error("Error processing user message:", error);

    // Return error stream
    const errorMessage =
      "Sorry, I encountered an error while processing your request. Please try again.";
    const encoder = new TextEncoder();
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      },
    });
  }
}
