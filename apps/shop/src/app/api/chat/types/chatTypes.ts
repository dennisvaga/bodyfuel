/**
 * Chat-related types and interfaces
 */

export type ChatMessage = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIMessageFormat = {
  id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

export type ProductData = {
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  slug: string;
};

export type StreamProductResponse = {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  description: string;
  category: string;
};

export type ChatbotSearchCriteria = {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  targetPrice?: number;
  brands?: string[];
  hasDiscount?: boolean;
  sortBy?: "price" | "name" | "relevance";
  sortOrder?: "asc" | "desc";
};
