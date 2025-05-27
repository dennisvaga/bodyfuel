import { z } from "zod";

/**
 * Chat message schema
 */
export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

/**
 * Chat request schema - supports both single message and messages array
 */
export const chatRequestSchema = z
  .object({
    conversationId: z.string().optional(),
    message: z.string().optional(), // Single message for new conversations
    messages: z.array(chatMessageSchema).optional(), // Message history
  })
  .refine(
    (data) => data.message || (data.messages && data.messages.length > 0),
    {
      message: "Either message or messages must be provided",
    }
  );

/**
 * Chat message type
 */
export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * AI message format
 */
export type AIMessageFormat = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Product data type
 */
export type ProductData = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  slug: string;
};

/**
 * Chatbot search criteria
 */
export type ChatbotSearchCriteria = {
  query: string;
  searchQuery?: string; // Alias for query
  category?: string;
  categoryId?: number;
  categories?: string[]; // Multiple categories
  minPrice?: number;
  maxPrice?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  limit?: number;
};

/**
 * Stream product response type
 */
export type StreamProductResponse = {
  productHtml: string;
  productInfo: string;
  productCount: number;
  hasMore: boolean;
  isStreaming?: boolean;
};
