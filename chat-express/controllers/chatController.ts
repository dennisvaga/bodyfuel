import { Request, Response as ExpressResponse } from "express";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText, createDataStreamResponse } from "ai";
import dotenv from "dotenv";
import { sendResponse } from "../../../utils/api-response.js";
import { handleError } from "../../../utils/handleErrors.js";
import { chatRequestSchema } from "../types/chat.types.js";
import * as queryService from "../services/queryService.js";
import * as conversationService from "../services/conversationService.js";
import * as messageService from "../services/messageService.js";
import * as streamService from "../services/streamService.js";
import * as streamUtils from "../utils/streamUtils.js";

// Load environment variables
dotenv.config({ path: "./.env" });

// Initialize DeepSeek AI
const DEEPSEEK_API = process.env.DEEPSEEK_API ?? "";

const deepseek = createDeepSeek({
  apiKey: DEEPSEEK_API,
  baseURL: "https://api.deepseek.com/v1",
});

/**
 * Process chat messages and generate AI responses
 *
 * @param req Express request
 * @param res Express response
 */
export async function processChat(
  req: Request,
  res: ExpressResponse
): Promise<void> {
  try {
    // Validate the request body
    const parseResult = chatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      sendResponse(res, 400, {
        success: false,
        message: "Invalid request format: " + parseResult.error.message,
      });
      return;
    }

    const { conversationId, messages } = parseResult.data;

    if (!messages || messages.length === 0) {
      sendResponse(res, 400, {
        success: false,
        message: "No messages provided",
      });
      return;
    }

    // Handle conversation management using the service
    const conversation = await conversationService.handleConversation(
      conversationId,
      messages
    );

    // Ensure conversation is not null before proceeding
    if (!conversation) {
      sendResponse(res, 404, {
        success: false,
        message: "Failed to create or load conversation.",
      });
      return;
    }

    // Get the latest user message
    const userMessage = conversationService.getLatestUserMessage(
      conversation.messages
    );

    if (!userMessage) {
      sendResponse(res, 400, {
        success: false,
        message: "No user message found in the conversation.",
      });
      return;
    }

    // Check if the message is about products
    const isProductQuery = queryService.isProductQuery(userMessage.content);

    // Format messages for AI
    const messagesForAI = messageService.formatMessagesForAI(
      conversation.messages
    );

    // If it's a product query, we'll stream products one by one
    if (isProductQuery) {
      await handleProductQuery(
        req,
        res,
        conversation.id,
        userMessage.content,
        messagesForAI
      );
    } else {
      // If it's not a product query, handle it normally
      await handleNormalQuery(req, res, conversation.id, messagesForAI);
    }
  } catch (error) {
    handleError(error, res);
  }
}

/**
 * Handle product query with streaming
 *
 * @param req Express request
 * @param res Express response
 * @param conversationId Conversation ID
 * @param userMessage User message content
 * @param messagesForAI Formatted messages for AI
 */
async function handleProductQuery(
  req: Request,
  res: ExpressResponse,
  conversationId: string,
  userMessage: string,
  messagesForAI: any[]
): Promise<void> {
  // Set up SSE headers
  streamUtils.setupSSEHeaders(res, conversationId, true);

  // Set additional headers for streaming
  res.setHeader("X-Streaming-Products", "true");

  // Parse the chatbot query
  const searchCriteria = await queryService.parseChatbotQuery(userMessage);

  // Use createDataStreamResponse from the AI SDK to stream products in real-time
  const response = createDataStreamResponse({
    execute: async (dataStream) => {
      // Start streaming products
      const productCount = await streamService.handleProductStreaming(
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
        });

        // Merge the AI response into the data stream
        result.mergeIntoDataStream(dataStream);
        return;
      }

      // Complete the product streaming with a simple response
      streamService.completeProductStreaming(dataStream, productCount);
    },
    onError: (error) => {
      console.error("Data stream error:", error);
      return error instanceof Error ? error.message : String(error);
    },
  });

  // Copy headers from the response
  streamUtils.copyResponseHeaders(response, res);

  // Process the stream
  await streamUtils.processStreamToResponse(response, res);
}

/**
 * Handle normal query with AI response
 *
 * @param req Express request
 * @param res Express response
 * @param conversationId Conversation ID
 * @param messagesForAI Formatted messages for AI
 */
async function handleNormalQuery(
  req: Request,
  res: ExpressResponse,
  conversationId: string,
  messagesForAI: any[]
): Promise<void> {
  // Create system message
  const systemMessage = messageService.createSystemMessage();

  // Set the conversation ID header
  streamUtils.setupSSEHeaders(res, conversationId);

  // Use the Vercel AI SDK streamText function for SSE
  const result = streamText({
    model: deepseek("deepseek-chat"),
    system: systemMessage,
    // Limit to the last 5 messages to reduce context size and improve response time
    messages: messagesForAI
      .slice(-5)
      .map((msg) => ({ role: msg.role, content: msg.content })),
  });

  try {
    // Create a Response object using toDataStreamResponse
    const response = result.toDataStreamResponse({
      getErrorMessage: (error: unknown) => {
        if (error == null) return "unknown error";
        if (typeof error === "string") return error;
        if (error instanceof Error) return error.message;
        return JSON.stringify(error);
      },
    });

    // Set additional headers for streaming
    res.setHeader("X-Streaming-Products", "false");

    // Process the stream
    await streamUtils.processStreamToResponse(response, res);

    // Handle any errors in processing the assistant response
    result.text.catch((err) =>
      console.error("Error processing assistant response:", err)
    );
  } catch (streamError: unknown) {
    console.error("Stream error:", streamError);
    if (!res.headersSent) {
      sendResponse(res, 500, {
        success: false,
        message:
          streamError instanceof Error ? streamError.message : "Stream error",
      });
    } else {
      res.end();
    }
  }
}
