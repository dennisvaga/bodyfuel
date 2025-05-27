import { Request, Response } from "express";
import { streamText, createDataStreamResponse } from "ai";
import { getDeepSeek, AI_CONFIG } from "./config/ai-config.js";
import { chatRequestSchema } from "./schema/api-schema.js";
import { ChatMessage } from "./chat.types.js";
import * as queryService from "./utils/query-utils.js";
import * as messageService from "./utils/message-utils.js";
import * as streamService from "./services/chat.service.js";
import * as streamUtils from "./utils/stream-utils.js";
import * as conversationService from "./services/conversation.service.js";
import { handleError } from "@/src/utils/handle-errors.js";
import { sendResponse } from "@utils/api-response.js";

/**
 * Chat controller responsible for handling HTTP requests related to chat
 */
export class ChatController {
  /**
   * Process chat messages and generate AI responses
   */
  async processChat(req: Request, res: Response): Promise<void> {
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
      const conversation = conversationService.handleConversation(
        conversationId,
        messages
      );

      console.log(
        `Controller: Created/retrieved conversation with ID: ${conversation.id}`
      );

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

      // Use the conversation ID from the conversation service
      const sessionId = conversation.id;

      console.log(`Controller: Using sessionId for streaming: ${sessionId}`);

      // If it's a product query, we'll stream products one by one
      if (isProductQuery) {
        await this.handleProductQuery(
          req,
          res,
          sessionId,
          userMessage.content,
          messagesForAI
        );
      } else {
        // If it's not a product query, handle it normally
        await this.handleNormalQuery(req, res, sessionId, messagesForAI);
      }
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Handle product query with streaming
   */
  private async handleProductQuery(
    req: Request,
    res: Response,
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
          searchCriteria,
          conversationId
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
            model: getDeepSeek()("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI
              .slice(-5)
              .map((msg) => ({ role: msg.role, content: msg.content })),
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokensProduct,
          });

          // Merge the AI response into the data stream
          result.mergeIntoDataStream(dataStream);

          // Save the "no products found" message to the conversation
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: noProductsMessage,
          };
          conversationService.addMessage(conversationId, assistantMessage);

          return;
        }

        // Complete the product streaming with a simple response
        streamService.completeProductStreaming(dataStream, productCount);

        // Product messages are already saved in handleProductStreaming - no need to save again
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
   */
  private async handleNormalQuery(
    req: Request,
    res: Response,
    conversationId: string,
    messagesForAI: any[]
  ): Promise<void> {
    // Create system message
    const systemMessage = messageService.createSystemMessage();

    // Set the conversation ID header
    streamUtils.setupSSEHeaders(res, conversationId);

    // Use the Vercel AI SDK streamText function for SSE
    const result = streamText({
      model: getDeepSeek()("deepseek-chat"),
      system: systemMessage,
      // Limit to the last 5 messages to reduce context size and improve response time
      messages: messagesForAI
        .slice(-5)
        .map((msg) => ({ role: msg.role, content: msg.content })),
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokensGeneral,
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

      // Save the AI response to the conversation
      try {
        const aiResponse = await result.text;
        if (aiResponse) {
          // Create a properly formatted assistant message
          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: aiResponse,
          };

          // Save the message to the conversation using the new helper method
          conversationService.addMessage(conversationId, assistantMessage);

          console.log("Saved AI response to conversation:", conversationId);
        }
      } catch (err) {
        console.error("Error processing assistant response:", err);
      }
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

  /**
   * Debug endpoint to see conversation state
   */
  async debugConversations(req: Request, res: Response): Promise<void> {
    try {
      conversationService.debugConversations();
      res.json({
        success: true,
        message: "Check server logs for conversation debug info",
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get a specific conversation for debugging
   */
  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const conversation = conversationService.getConversation(conversationId);
      res.json({ success: true, conversation });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new ChatController();
