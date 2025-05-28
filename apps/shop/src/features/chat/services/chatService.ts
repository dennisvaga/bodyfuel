import {
  ApiResult,
  ContentType,
  fetchData,
  fetchStreamingData,
  FetchMethod,
} from "@repo/shared";
import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from "../types/chat.types";

/**
 * Consolidated chat service for handling chat functionality
 * Provides methods to send messages to the chat API with both JSON and streaming responses
 */
export const chatService = {
  /**
   * Send a message to the chat API with JSON response
   * @param data The chat request data containing messages and optional conversationId
   * @returns Promise with the API result
   */
  sendMessage: async (data: ChatRequest): Promise<ApiResult<ChatResponse>> => {
    return await fetchData({
      slug: "chat",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  /**
   * Send a message to the chat API with streaming response
   * @param data The chat request data containing messages and optional conversationId
   * @returns Promise with the raw Response object for streaming
   */
  sendStreamingMessage: async (data: ChatRequest): Promise<Response> => {
    return await fetchStreamingData({
      slug: "chat",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": ContentType.JSON,
      },
    });
  },
};
