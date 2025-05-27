import { ChatMessage, AIMessageFormat } from "../types/chatTypes";

/**
 * Get the current message from either single message or messages array
 */
export function getCurrentMessage(
  message?: string,
  messages: ChatMessage[] = []
): string {
  return (
    message ||
    (messages.length > 0 ? messages[messages.length - 1].content : "")
  );
}

/**
 * Format messages for AI consumption
 */
export function formatMessagesForAI(messages: ChatMessage[]): AIMessageFormat[] {
  return messages.map((msg) => ({
    id: msg.id || Date.now().toString(),
    role: msg.role,
    content: msg.content,
  }));
}

/**
 * Create a new message with timestamp ID
 */
export function createMessage(
  role: "user" | "assistant" | "system",
  content: string
): AIMessageFormat {
  return {
    id: Date.now().toString(),
    role,
    content,
  };
}

/**
 * Determine if a message is a product query
 */
export function isProductQuery(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Product-related keywords
  const productKeywords = [
    "protein", "creatine", "vitamin", "supplement", "bcaa", "omega",
    "collagen", "pre workout", "post workout", "whey", "casein",
    "amino", "mass gainer", "fat burner", "probiotic", "glutamine",
    "arginine", "carnitine", "zinc", "magnesium", "calcium",
    "multivitamin", "fish oil", "caffeine", "beta alanine"
  ];
  
  // Action keywords
  const actionKeywords = [
    "find", "search", "looking for", "show me", "do you have",
    "suggest", "recommend", "want", "need", "buy", "purchase",
    "what", "which", "any", "help me find", "i need", "show"
  ];
  
  // Check for product keywords
  const hasProductKeyword = productKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for action keywords
  const hasActionKeyword = actionKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Check for price-related queries
  const hasPriceQuery = /\$\d+|price|cost|cheap|expensive|under|over|between/.test(lowerMessage);
  
  // Check for category mentions
  const hasCategoryQuery = /category|type|kind|brand/.test(lowerMessage);
  
  return hasProductKeyword || (hasActionKeyword && (hasPriceQuery || hasCategoryQuery));
}
