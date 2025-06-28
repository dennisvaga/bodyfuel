import { AIMessageFormat, ChatMessage } from "@repo/shared";
/**
 * Format conversation messages for AI
 *
 * @param messages Array of conversation messages
 * @returns Formatted messages for AI
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
 *
 * @param productInfo Product information string
 * @param productHtml Product HTML string
 * @returns System message for AI
 */
export function createSystemMessage(
  productInfo: string = "",
  productHtml: string = ""
): string {
  // Create a concise base system message
  let systemMessage = `You are BodyFuel's assistant. Be concise and helpful about fitness products.`;

  // Common critical instructions for both scenarios
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

  // Add product info if available
  if (productInfo) {
    systemMessage += `\n\nProduct information (for your reference only, DO NOT list these products in text form):\n${productInfo}`;
  }

  // Add product HTML if available
  if (productHtml) {
    systemMessage += `\n\nIMPORTANT: Include this EXACT HTML in your response:\n${productHtml}\nDO NOT modify this HTML.`;

    // Add explicit instruction for product data scenario
    systemMessage += `\n\nCRITICAL INSTRUCTIONS (YOU MUST FOLLOW THESE EXACTLY):
1. ONLY suggest products that are in the database and returned in the product data above.
2. NEVER suggest products that aren't in the provided product data.
3. NEVER output HTML directly in your text response - the product cards will be rendered automatically.
4. DO NOT list products in text form - the cards already display all necessary information.
5. Start with an engaging introduction like "Great choice! I found some excellent [product type] for you" or "Here are some top-rated [category] options that should work perfectly"
6. Provide helpful context about the products without listing them (e.g., "These range from budget-friendly to premium options" or "I've included both beginner and advanced formulas")
7. If no products are found, simply state that no products matching the criteria were found.
8. DO NOT use your general knowledge about vitamins, supplements, or fitness products - ONLY use the specific products provided in the product data.
9. For queries about vitamins, protein, or any other product category, ONLY show the products from the database, not generic information.
10. Be enthusiastic and helpful while staying focused on the specific products available.${commonInstructions}`;
  } else {
    // Add instruction for when no product data is available
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
 * Create a simple response message
 *
 * @param productCount Number of products found
 * @returns Simple response message
 */
export function createSimpleResponseMessage(productCount: number): string {
  return `Here are the top ${Math.min(productCount, 5)} products matching your search.`;
}

/**
 * Create a no products found message
 *
 * @returns No products found message
 */
export function createNoProductsMessage(): string {
  return "I don't see any products matching that query. Let me help you find something else.";
}

/**
 * Create a search error message
 *
 * @returns Search error message
 */
export function createSearchErrorMessage(): string {
  return "Sorry, I encountered an error while searching for products. Please try again with a different query.";
}
