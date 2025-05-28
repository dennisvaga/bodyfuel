/**
 * Consolidated chat types for the frontend
 */

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  parts?: Array<{
    type: string;
    text: string;
  }>;
}

export interface ChatRequest {
  conversationId?: string;
  messages: ChatMessage[];
}

export interface ChatResponse {
  conversationId: string;
  message?: ChatMessage;
  messages?: ChatMessage[];
}

export interface ChatProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  imageUrl?: string;
  category?: {
    name: string;
  };
  className?: string;
}

export interface ProductStreamData {
  type: "product";
  products: Omit<ChatProductCardProps, "className">[];
  count: number;
}
