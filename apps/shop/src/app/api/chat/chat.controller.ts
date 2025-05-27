import { NextRequest } from "next/server";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { streamText, createDataStreamResponse } from "ai";
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

    // Use createDataStreamResponse for proper streaming like the old Express version
    return createDataStreamResponse({
      execute: async (dataStream) => {
        // Search for products
        const products =
          await chatService.searchProductsForChat(searchCriteria);

        // If products found, stream them
        if (products && products.length > 0) {
          // Send product data through the stream
          dataStream.writeData({
            type: "product",
            products: products.map((product) => ({
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images?.[0]?.imageUrl || "/media/blankImage.jpg",
              price: product.variants?.[0]?.price || 0,
              description: product.description || "",
              category: "Product", // Use default since category relation might not be loaded
            })),
          });

          // Send status update
          dataStream.writeData({
            type: "status",
            status: "complete",
            message: `Found ${products.length} products`,
          });

          // Format products for AI context
          const productInfo = chatService.formatProductsForAI(products);
          const productHtml = chatService.createProductHtml(products);

          // Create system message with product context
          const systemMessage = chatService.createSystemMessage(
            productInfo,
            "" // Don't include HTML in system message
          );

          // Format messages for AI
          const messagesForAI = chatService.formatMessagesForAI(messages);

          // Add current message
          messagesForAI.push({
            id: Date.now().toString(),
            role: "user",
            content: message,
          });

          // Generate AI response and merge into stream
          const result = streamText({
            model: deepseek("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI,
            temperature: 0.7,
            maxTokens: 500,
          });

          // Merge AI response into the data stream
          result.mergeIntoDataStream(dataStream);
        } else {
          // No products found - send status and generate AI response
          dataStream.writeData({
            type: "status",
            status: "no_products",
            message: "No products found matching your criteria",
          });

          const systemMessage = chatService.createSystemMessage(
            "No products were found for this search.",
            ""
          );

          const messagesForAI = chatService.formatMessagesForAI(messages);
          messagesForAI.push({
            id: Date.now().toString(),
            role: "user",
            content: message,
          });

          const result = streamText({
            model: deepseek("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI,
            temperature: 0.7,
            maxTokens: 300,
          });

          result.mergeIntoDataStream(dataStream);
        }
      },
      onError: (error) => {
        console.error("Data stream error:", error);
        return error instanceof Error ? error.message : String(error);
      },
      headers: {
        "X-Streaming-Products": "true",
        "X-Product-Query": "true",
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

    // For general chat, we can use the simpler toDataStreamResponse
    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI,
      temperature: 0.7,
      maxTokens: 300,
    });

    // Return the streaming response with proper headers
    return result.toDataStreamResponse({
      headers: {
        "X-Streaming-Products": "false",
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
