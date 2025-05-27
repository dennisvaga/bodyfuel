import { NextRequest } from "next/server";
import { streamText, createDataStreamResponse } from "ai";
import { deepseek, AI_CONFIG } from "./config/aiConfig";
import { chatRequestSchema } from "./schema/apiSchema";
import * as queryService from "./utils/queryUtils";
import * as messageService from "./utils/messageUtils";
import * as streamingService from "./services/chatStreamingService";
import {
  createValidationErrorResponse,
  createErrorResponse,
  createInternalErrorResponse,
} from "./utils/errorHandler";

/**
 * Handle POST requests to the chat API
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return createValidationErrorResponse(parseResult.error.message);
    }

    const { conversationId, messages } = parseResult.data;

    if (!messages || messages.length === 0) {
      return createErrorResponse("No messages provided", 400);
    }

    // Get the latest user message (last message in the array)
    const userMessage = messages[messages.length - 1];

    if (!userMessage || userMessage.role !== "user") {
      return createErrorResponse(
        "No user message found in the conversation.",
        400
      );
    }

    // Check if the message is about products
    const isProductQuery = queryService.isProductQuery(userMessage.content);

    // Format messages for AI
    const messagesForAI = messageService.formatMessagesForAI(messages);

    // Generate a simple conversation ID if not provided
    const sessionId = conversationId || `chat_${Date.now()}`;

    // If it's a product query, we'll stream products one by one
    if (isProductQuery) {
      return handleProductQuery(sessionId, userMessage.content, messagesForAI);
    } else {
      // If it's not a product query, handle it normally
      return handleNormalQuery(sessionId, messagesForAI);
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return createInternalErrorResponse(error);
  }
}

/**
 * Handle product query with streaming
 */
async function handleProductQuery(
  conversationId: string,
  userMessage: string,
  messagesForAI: any[]
): Promise<Response> {
  // Parse the chatbot query
  const searchCriteria = await queryService.parseChatbotQuery(userMessage);

  // Use createDataStreamResponse from the AI SDK to stream products in real-time
  const response = createDataStreamResponse({
    execute: async (dataStream) => {
      // Start streaming products
      const productCount = await streamingService.handleProductStreaming(
        dataStream,
        userMessage,
        searchCriteria
      );

      // If no products were found, generate an AI response
      if (productCount === 0) {
        const noProductsMessage = messageService.createNoProductsMessage();
        const systemMessage = messageService.createSystemMessage(
          noProductsMessage,
          ""
        );

        // Generate AI response for no products
        const result = streamText({
          model: deepseek("deepseek-chat"),
          system: systemMessage,
          messages: messagesForAI
            .slice(-5)
            .map((msg) => ({ role: msg.role, content: msg.content })),
          temperature: AI_CONFIG.temperature,
          maxTokens: AI_CONFIG.maxTokensProduct,
        });

        // Merge the AI response into the data stream
        result.mergeIntoDataStream(dataStream);
        return;
      }

      // Complete the product streaming with a simple response
      streamingService.completeProductStreaming(dataStream, productCount);
    },
    onError: (error) => {
      console.error("Data stream error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });

  // Add conversation ID header
  const headers = new Headers(response.headers);
  headers.set("X-Conversation-ID", conversationId);
  headers.set("X-Streaming-Products", "true");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Handle normal query with AI response
 */
async function handleNormalQuery(
  conversationId: string,
  messagesForAI: any[]
): Promise<Response> {
  // Create system message
  const systemMessage = messageService.createSystemMessage();

  try {
    // Use the Vercel AI SDK streamText function for SSE
    const result = streamText({
      model: deepseek("deepseek-chat"),
      system: systemMessage,
      // Limit to the last 5 messages to reduce context size and improve response time
      messages: messagesForAI
        .slice(-5)
        .map((msg) => ({ role: msg.role, content: msg.content })),
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokensGeneral,
    });

    // Create a Response object using toDataStreamResponse
    const response = result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        if (error == null) return "unknown error";
        if (typeof error === "string") return error;
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });

    // Add conversation ID header
    const headers = new Headers(response.headers);
    headers.set("X-Conversation-ID", conversationId);
    headers.set("X-Streaming-Products", "false");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (streamError: unknown) {
    console.error("Stream error:", streamError);
    return createInternalErrorResponse(streamError);
  }
}
