import z from "zod";
import type {
  chatMessageSchema,
  chatRequestSchema,
} from "../schemas/chatSchema.js";

/**
 * AI message format for internal processing
 */
export type AIMessageFormat = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

/**
 * Conversation type for chat management
 */
export type Conversation = {
  id: string;
  messages: ChatMessage[];
};

/**
 * Product data type for chat responses
 */
export type ProductData = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  slug: string;
  category?: {
    id: number;
    name: string;
  };
};

/**
 * Chatbot search criteria for product queries
 */
export type ChatbotSearchCriteria = {
  searchQuery: string;
  minPrice?: number;
  maxPrice?: number;
  targetPrice?: number;
  categoryId?: number;
};

/**
 * Chat response types for data streaming
 */
export type ChatDataStreamType = {
  type: "product" | "status" | "error";
  products?: ProductData[];
  message?: string;
  timestamp?: number;
  count?: number;
};

/**
 * Chat service response type
 */
export type ChatResponse = {
  conversationId: string;
  message?: ChatMessage;
  messages?: ChatMessage[];
};

// Inferred types from schemas only
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
