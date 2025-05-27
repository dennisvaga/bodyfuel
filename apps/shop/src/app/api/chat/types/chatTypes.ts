import {
  chatMessageSchema,
  chatRequestSchema,
  chatResponseSchema,
  errorResponseSchema,
} from "../schema/apiSchema";
import { z } from "zod";

// Type exports from schemas
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequestType = z.infer<typeof chatRequestSchema>;
export type ChatResponseType = z.infer<typeof chatResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

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
