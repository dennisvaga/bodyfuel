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

      // Check if this is a welcome message (first interaction)
      const isWelcomeMessage = userMessage.content.toLowerCase().trim() === "welcome" || 
                              conversation.messages.length <= 2; // Only user message + potential assistant response

      // Check if the message is about products (but not if it's a welcome message)
      const isProductQuery = !isWelcomeMessage && queryService.isProductQuery(userMessage.content);

      // Format messages for AI
      const messagesForAI = messageService.formatMessagesForAI(
        conversation.messages
      );

      if (isWelcomeMessage) {
        // Handle welcome message with a simple greeting
        await this.handleWelcomeMessage(req, res, conversation.id, messagesForAI);
      } else if (isProductQuery) {
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

    // Set streaming headers to prevent buffering
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.setHeader("X-Proxy-Buffering", "no"); // Disable general proxy buffering
    res.setHeader("X-Conversation-Id", conversationId);
    res.setHeader("X-Streaming-Products", "true");

    // Use pipeDataStreamToResponse to stream both products and AI response
    pipeDataStreamToResponse(res, {
      execute: async (dataStream) => {
        console.log("Starting data stream execution");

        // Get products but don't stream them yet
        const products = await chatRepository.findProducts(searchCriteria, 5);
        console.log(`Found ${products.length} products for streaming`);

        if (products.length > 0) {
          // Create system message with product context for immediate AI response
          const productInfo = products
            .map((p) => `${p.name} - $${p.price}\n${p.description}`)
            .join("\n\n");
          const systemMessage = messageService.createSystemMessage(
            productInfo,
            ""
          );

          // Stream AI response FIRST to give immediate feedback
          console.log("Starting AI response stream");
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

          // Merge AI response into the data stream first
          result.mergeIntoDataStream(dataStream);

          // Wait for AI response to finish, then stream products
          try {
            const aiResponse = await result.text;
            console.log("AI response finished, now streaming products");
            
            // Save AI response to conversation
            const assistantMessage: ChatMessage = {
              role: "assistant",
              content: aiResponse,
            };
            conversationService.addMessage(conversationId, assistantMessage);

            // Now stream products one by one after AI response
            for (let i = 0; i < products.length; i++) {
              const product = products[i];
              console.log(`Streaming product ${i + 1}: ${product.name}`, product);

              await dataStream.writeData({
                type: "product",
                products: [product], // Send one product at a time
                count: i + 1,
              });

              // Add delay to maintain 1-by-1 streaming effect
              if (i < products.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced delay since AI already responded
              }
            }
            console.log("Finished streaming all products");
          } catch (error) {
            console.error("Error in product streaming:", error);
          }

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

    // Set streaming headers to prevent buffering
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.setHeader("X-Proxy-Buffering", "no"); // Disable general proxy buffering
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

  /**
   * Handle welcome messages with AI-generated greeting
   */
  private async handleWelcomeMessage(
    req: Request,
    res: Response,
    conversationId: string,
    messagesForAI: any[]
  ): Promise<void> {
    const systemMessage = `You are a helpful AI assistant for BodyFuel, a fitness and nutrition supplement store.
    
    This appears to be the start of a conversation. Respond with a friendly welcome message that:
    - Greets them warmly
    - Mentions you can help find products or answer questions about BodyFuel
    - Asks what they're looking for today
    - Keep it concise and welcoming (1-2 sentences max)
    - Use a friendly tone with appropriate emojis
    - Do NOT wrap your response in quotation marks
    - Respond directly without any formatting or quotes`;

    const result = streamText({
      model: getDeepSeek()("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI.slice(-2).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7, // Slightly more creative for welcome messages
      maxTokens: 100, // Keep welcome messages short
    });

    // Set streaming headers to prevent buffering
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
    res.setHeader("X-Proxy-Buffering", "no"); // Disable general proxy buffering
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
}

export default new ChatController();
