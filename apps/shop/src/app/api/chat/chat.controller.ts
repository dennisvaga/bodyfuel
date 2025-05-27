import { NextRequest } from "next/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText } from "ai";
import { chatRequestSchema, ChatMessage } from "./chat.types";
import * as chatService from "./chat.service";

// Initialize DeepSeek AI
const DEEPSEEK_API = process.env.DEEPSEEK_API ?? "";

const deepseek = createDeepSeek({
  apiKey: DEEPSEEK_API,
  baseURL: "https://api.deepseek.com/v1",
});

/**
 * Handle chat requests from Next.js API route
 */
export async function handleChatRequest(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = chatRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { message, messages = [] } = validationResult.data;

    // Get the current message - either from single message or last in messages array
    const currentMessage =
      message ||
      (messages.length > 0 ? messages[messages.length - 1].content : "");

    if (!currentMessage) {
      return new Response(
        JSON.stringify({
          error: "Invalid request",
          message: "No message content provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if this is a product query
    const isProductQuery = chatService.isProductQuery(currentMessage);

    if (isProductQuery) {
      return await handleProductQuery(currentMessage, messages);
    } else {
      return await handleGeneralChat(currentMessage, messages);
    }
  } catch (error) {
    console.error("Error in chat controller:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to process chat request",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Handle product-related queries with streaming
 */
async function handleProductQuery(message: string, messages: ChatMessage[]) {
  try {
    // Parse the query to extract search criteria
    const searchCriteria = await chatService.parseChatbotQuery(message);

    // Search for products
    const products = await chatService.searchProductsForChat(searchCriteria);

    // Format products for AI context
    const productInfo = chatService.formatProductsForAI(products);
    const productHtml = chatService.createProductHtml(products);

    // Create system message with product context
    const systemMessage = chatService.createSystemMessage(
      productInfo,
      productHtml
    );

    // Format messages for AI
    const messagesForAI = chatService.formatMessagesForAI(messages);

    // Add current message
    messagesForAI.push({
      id: Date.now().toString(),
      role: "user",
      content: message,
    });

    // Stream the AI response
    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI,
      temperature: 0.7,
      maxTokens: 500,
    });

    // Return the streaming response
    return result.toDataStreamResponse({
      headers: {
        "X-Product-Query": "true",
        "X-Product-Count": products.length.toString(),
        "X-Product-HTML": productHtml,
      },
    });
  } catch (error) {
    console.error("Error handling product query:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process product query",
        message: "Please try again",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Handle general chat queries
 */
async function handleGeneralChat(message: string, messages: ChatMessage[]) {
  try {
    // Create system message for general chat
    const systemMessage = chatService.createSystemMessage();

    // Format messages for AI
    const messagesForAI = chatService.formatMessagesForAI(messages);

    // Add current message
    messagesForAI.push({
      id: Date.now().toString(),
      role: "user",
      content: message,
    });

    // Stream the AI response
    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI,
      temperature: 0.7,
      maxTokens: 300,
    });

    // Return the streaming response
    return result.toDataStreamResponse({
      headers: {
        "X-Product-Query": "false",
      },
    });
  } catch (error) {
    console.error("Error handling general chat:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat message",
        message: "Please try again",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
