import { chatMessageSchema, chatRequestSchema } from "./schema/api-schema.js";
import { z } from "zod";

// Type exports from schemas
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestType = z.infer<typeof chatRequestSchema>;

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
