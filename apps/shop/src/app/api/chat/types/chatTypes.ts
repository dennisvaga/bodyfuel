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
 * Chat request schema
 */
export const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(chatMessageSchema),
});

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
 * Conversation type
 */
export type Conversation = {
  id: string;
  messages: ChatMessage[];
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
  searchQuery: string;
  minPrice?: number;
  maxPrice?: number;
  targetPrice?: number;
  categoryId?: number;
};

/**
 * Stream product response
 */
export type StreamProductResponse = {
  productInfo: string;
  productHtml: string;
  isStreaming: boolean;
};
