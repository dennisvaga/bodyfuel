import { Request, Response } from "express";
import { handleError } from "@utils/handleErrors.js";
import { sendResponse } from "@utils/apiResponse.js";
import { chatRequestSchema } from "./schema/api-schema.js";
import * as queryService from "./utils/query-utils.js";
import * as messageService from "./utils/message-utils.js";
import * as streamingService from "./services/chat.service.js";

/**
 * Chat controller responsible for handling HTTP requests related to chat
 */
export class ChatController {
  /**
   * Handle chat messages with streaming response
   */
  async handleChat(req: Request, res: Response) {
    try {
      // Parse and validate the request body
      const parseResult = chatRequestSchema.safeParse(req.body);

      if (!parseResult.success) {
        return sendResponse(res, 400, {
          success: false,
          message: `Invalid request data: ${parseResult.error.message}`,
        });
      }

      const { conversationId, messages } = parseResult.data;

      if (!messages || messages.length === 0) {
        return sendResponse(res, 400, {
          success: false,
          message: "No messages provided",
        });
      }

      // Get the latest user message (last message in the array)
      const userMessage = messages[messages.length - 1];

      if (!userMessage || userMessage.role !== "user") {
        return sendResponse(res, 400, {
          success: false,
          message: "No user message found in the conversation.",
        });
      }

      // Check if the message is about products
      const isProductQuery = queryService.isProductQuery(userMessage.content);

      // Format messages for AI
      const messagesForAI = messageService.formatMessagesForAI(messages);

      // Generate a simple conversation ID if not provided
      const sessionId = conversationId || `chat_${Date.now()}`;

      // Set up Server-Sent Events headers
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
        "X-Conversation-ID": sessionId,
        "X-Streaming-Products": isProductQuery ? "true" : "false",
      });

      // If it's a product query, we'll stream products one by one
      if (isProductQuery) {
        await this.handleProductQuery(
          res,
          sessionId,
          userMessage.content,
          messagesForAI
        );
      } else {
        // If it's not a product query, handle it normally
        await this.handleNormalQuery(res, sessionId, messagesForAI);
      }
    } catch (error) {
      console.error("Chat API error:", error);
      if (!res.headersSent) {
        handleError(error, res);
      }
    }
  }

  /**
   * Handle product query with streaming
   */
  private async handleProductQuery(
    res: Response,
    conversationId: string,
    userMessage: string,
    messagesForAI: any[]
  ): Promise<void> {
    try {
      // Parse the chatbot query
      const searchCriteria = await queryService.parseChatbotQuery(userMessage);

      // Create a custom data stream writer for Express SSE
      const dataStream = {
        write: (data: string) => {
          res.write(`data: ${data}\n\n`);
        },
        end: () => {
          res.write("data: [DONE]\n\n");
          res.end();
        },
      };

      // Start streaming products
      const productCount = await streamingService.handleProductStreaming(
        dataStream as any,
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

        // Send a simple AI response for no products
        const aiResponse = `I couldn't find any products matching "${userMessage}". Try searching for different terms or browse our categories.`;

        res.write(
          `data: ${JSON.stringify({ type: "text", content: aiResponse })}\n\n`
        );
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      // Complete the product streaming with a simple response
      streamingService.completeProductStreaming(
        dataStream as any,
        productCount
      );
    } catch (error) {
      console.error("Product query error:", error);
      res.write(
        `data: ${JSON.stringify({ type: "error", content: "An error occurred while processing your request." })}\n\n`
      );
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }

  /**
   * Handle normal query with AI response
   */
  private async handleNormalQuery(
    res: Response,
    conversationId: string,
    messagesForAI: any[]
  ): Promise<void> {
    try {
      // Create system message
      const systemMessage = messageService.createSystemMessage();

      // For now, send a simple response since we need to replace AI SDK
      const simpleResponse =
        "I'm here to help you find products. What are you looking for?";

      res.write(
        `data: ${JSON.stringify({ type: "text", content: simpleResponse })}\n\n`
      );
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("Normal query error:", error);
      res.write(
        `data: ${JSON.stringify({ type: "error", content: "An error occurred while processing your request." })}\n\n`
      );
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
}

export default new ChatController();
