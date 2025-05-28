import { Request, Response } from "express";
import { streamText } from "ai";
import { getDeepSeek, AI_CONFIG } from "./config/ai-config.js";
import { chatRequestSchema } from "./schema/api-schema.js";
import { ChatMessage, ChatbotSearchCriteria } from "./chat.types.js";
import * as queryService from "./utils/query-utils.js";
import * as messageService from "./utils/message-utils.js";
import * as chatRepository from "./chat.repository.js";
import * as productService from "./services/chat-product.service.js";
import * as conversationService from "./services/conversation.service.js";
import { handleError } from "@/src/utils/handle-errors.js";
import { sendResponse } from "@utils/api-response.js";

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

      let systemMessage: string;
      
      if (isProductQuery) {
        // Get product info synchronously instead of streaming
        const searchCriteria = await queryService.parseChatbotQuery(userMessage.content);
        const productInfo = await this.getProductInfoForSystemMessage(searchCriteria);
        systemMessage = messageService.createSystemMessage(productInfo, "");
      } else {
        systemMessage = messageService.createSystemMessage();
      }

      // Use AI SDK's built-in streaming for all responses
      const result = streamText({
        model: getDeepSeek()("deepseek-chat"),
        system: systemMessage,
        messages: messagesForAI.slice(-5).map((msg) => ({ 
          role: msg.role, 
          content: msg.content 
        })),
        temperature: AI_CONFIG.temperature,
        maxTokens: isProductQuery ? AI_CONFIG.maxTokensProduct : AI_CONFIG.maxTokensGeneral,
      });

      // Set conversation ID header
      res.setHeader("X-Conversation-Id", conversation.id);
      res.setHeader("X-Streaming-Products", isProductQuery.toString());

      // Let AI SDK handle all the streaming automatically
      result.pipeDataStreamToResponse(res);

      // Save the AI response to conversation once complete
      result.text.then((aiResponse) => {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: aiResponse,
        };
        conversationService.addMessage(conversation.id, assistantMessage);
      }).catch((err) => {
        console.error("Error saving AI response:", err);
      });
      
    } catch (error) {
      handleError(error, res);
    }
  }

  /**
   * Get product information synchronously for system message
   */
  private async getProductInfoForSystemMessage(searchCriteria: ChatbotSearchCriteria): Promise<string> {
    try {
      const products = await chatRepository.findProducts(searchCriteria);
      
      if (products.length === 0) {
        return "No products found matching the search criteria.";
      }

      // Format products for system message
      const productList = products.slice(0, 5).map(product => 
        `${product.name} - $${product.price}\n${product.description}`
      ).join('\n\n');

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
