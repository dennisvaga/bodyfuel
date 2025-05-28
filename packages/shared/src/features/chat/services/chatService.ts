import { fetchData, ContentType, FetchMethod } from "@repo/shared";
import type { ApiResult } from "@repo/shared";
import type { ChatMessage, ChatRequest } from "../schemas/chatSchema.js";

/**
 * Service for handling chat-related API calls
 */
export const chatService = {
  /**
   * Send a chat message to the AI assistant
   * @param messages Array of chat messages
   * @param conversationId Optional conversation ID for continuing a conversation
   * @returns API result with the assistant's response
   */
  sendMessage: async (
    messages: ChatMessage[],
    conversationId?: string
  ): Promise<ApiResult<any>> => {
    return await fetchData({
      slug: "chat",
      method: FetchMethod.POST,
      body: JSON.stringify({ messages, conversationId }),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },
};
