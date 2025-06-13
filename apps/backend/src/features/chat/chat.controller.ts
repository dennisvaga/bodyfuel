import { Request, Response } from "express";
import { streamText, pipeDataStreamToResponse } from "ai";
import { getDeepSeek, AI_CONFIG } from "./config/ai-config.js";
import {
  chatRequestSchema,
  ChatMessage,
  ChatbotSearchCriteria,
} from "@repo/shared";
import * as queryService from "./utils/query-utils.js";
import * as messageService from "./utils/message-utils.js";
import * as chatRepository from "./chat.repository.js";
import * as productService from "./services/chat-product.service.js";
import * as conversationService from "./services/conversation.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Chat controller responsible for handling HTTP requests related to chat
 */
export class ChatController {
  /**
   * Process chat messages and generate AI responses using AI SDK built-in streaming
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

      if (isProductQuery) {
        // Handle product queries with data streaming
        await this.handleProductQuery(
          req,
          res,
          conversation.id,
          userMessage.content,
          messagesForAI
        );
      } else {
        // Handle normal queries with simple text streaming
        await this.handleNormalQuery(req, res, conversation.id, messagesForAI);
      }
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Handle product queries with AI SDK data streaming
   */
  private async handleProductQuery(
    req: Request,
    res: Response,
    conversationId: string,
    userMessage: string,
    messagesForAI: any[]
  ): Promise<void> {
    const searchCriteria = await queryService.parseChatbotQuery(userMessage);

    // Set headers
    res.setHeader("X-Conversation-Id", conversationId);
    res.setHeader("X-Streaming-Products", "true");

    // Use pipeDataStreamToResponse to stream both products and AI response
    pipeDataStreamToResponse(res, {
      execute: async (dataStream) => {
        console.log("Starting data stream execution");

        // Stream products first
        const products = await chatRepository.findProducts(searchCriteria, 5);

        console.log(`Found ${products.length} products for streaming`);

        if (products.length > 0) {
          // Stream each product individually to maintain the 1-by-1 effect
          for (let i = 0; i < products.length; i++) {
            const product = products[i];

            console.log(`Streaming product ${i + 1}: ${product.name}`, product);

            // Stream this product (the findProducts already returns properly formatted products)
            await dataStream.writeData({
              type: "product",
              products: [product], // Send one product at a time
              count: i + 1,
            });

            // Add delay to maintain 1-by-1 streaming effect
            if (i < products.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

          console.log("Finished streaming products, starting AI response");

          // Create system message with product context
          const productInfo = products
            .map((p) => `${p.name} - $${p.price}\n${p.description}`)
            .join("\n\n");
          const systemMessage = messageService.createSystemMessage(
            productInfo,
            ""
          );

          // Stream AI response
          const result = streamText({
            model: getDeepSeek()("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI.slice(-5).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokensProduct,
          });

          // Merge AI response into the data stream
          result.mergeIntoDataStream(dataStream);

          // Save AI response to conversation
          result.text
            .then((aiResponse) => {
              const assistantMessage: ChatMessage = {
                role: "assistant",
                content: aiResponse,
              };
              conversationService.addMessage(conversationId, assistantMessage);
            })
            .catch(console.error);
        } else {
          // No products found - stream AI response only
          const noProductsMessage = messageService.createNoProductsMessage();
          const systemMessage = messageService.createSystemMessage(
            noProductsMessage,
            ""
          );

          const result = streamText({
            model: getDeepSeek()("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI.slice(-5).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokensProduct,
          });

          result.mergeIntoDataStream(dataStream);

          // Save response
          result.text
            .then((aiResponse) => {
              const assistantMessage: ChatMessage = {
                role: "assistant",
                content: noProductsMessage,
              };
              conversationService.addMessage(conversationId, assistantMessage);
            })
            .catch(console.error);
        }
      },
      onError: (error) => {
        console.error("Data stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
    });
  }

  /**
   * Handle normal queries with simple AI text streaming
   */
  private async handleNormalQuery(
    req: Request,
    res: Response,
    conversationId: string,
    messagesForAI: any[]
  ): Promise<void> {
    const systemMessage = messageService.createSystemMessage();

    const result = streamText({
      model: getDeepSeek()("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI.slice(-5).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokensGeneral,
    });

    // Set headers
    res.setHeader("X-Conversation-Id", conversationId);
    res.setHeader("X-Streaming-Products", "false");

    // Let AI SDK handle the streaming
    result.pipeDataStreamToResponse(res);

    // Save AI response to conversation
    result.text
      .then((aiResponse) => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: aiResponse,
        };
        conversationService.addMessage(conversationId, assistantMessage);
      })
      .catch(console.error);
  }

  /**
   * Get product information synchronously for system message
   */
  private async getProductInfoForSystemMessage(
    searchCriteria: ChatbotSearchCriteria
  ): Promise<string> {
    try {
      const products = await chatRepository.findProducts(searchCriteria);

      if (products.length === 0) {
        return "No products found matching the search criteria.";
      }

      // Format products for system message
      const productList = products
        .slice(0, 5)
        .map(
          (product) =>
            `${product.name} - $${product.price}\n${product.description}`
        )
        .join("\n\n");

      return `Here are the available products:\n\n${productList}`;
    } catch (error) {
      console.error("Error fetching products for system message:", error);
      return "Error retrieving product information.";
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
