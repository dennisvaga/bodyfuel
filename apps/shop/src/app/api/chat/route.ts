import { NextRequest } from "next/server";
import { streamText, createDataStreamResponse } from "ai";
import { productService } from "@repo/shared";
import { chatRequestSchema } from "./schema/apiSchema";
import { ChatMessage } from "./types/chatTypes";
import { deepseek, AI_CONFIG } from "./config/aiConfig";
import {
  getCurrentMessage,
  formatMessagesForAI,
  createMessage,
  isProductQuery,
} from "./utils/messageUtils";
import {
  validateChatRequest,
  validateMessage,
  createErrorResponse,
} from "./utils/apiHelpers";
import { parseChatbotQuery } from "./utils/chatUtils";
import {
  formatProductsForAI,
  createProductHtml,
  createSystemMessage,
} from "./utils/productUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = chatRequestSchema.safeParse(body);
    const validation = validateChatRequest(validationResult);

    if (!validation.success) {
      return validation.response;
    }

    const { message, messages = [] } = validation.data;

    // Get the current message - either from single message or last in messages array
    const currentMessage = getCurrentMessage(message, messages);

    // Validate that we have a message
    const messageValidation = validateMessage(currentMessage);
    if (messageValidation) {
      return messageValidation;
    }

    // Check if this is a product query
    const isProductMessage = isProductQuery(currentMessage);

    if (isProductMessage) {
      return await handleProductQuery(currentMessage, messages);
    } else {
      return await handleGeneralChat(currentMessage, messages);
    }
  } catch (error) {
    console.error("Error in chat route:", error);
    return createErrorResponse(
      "Internal server error",
      "Failed to process chat request"
    );
  }
}

/**
 * Handle product-related queries with streaming
 */
async function handleProductQuery(message: string, messages: ChatMessage[]) {
  try {
    // Parse the query to extract search criteria
    const searchCriteria = await parseChatbotQuery(message);

    // Use createDataStreamResponse for proper streaming
    return createDataStreamResponse({
      execute: async (dataStream) => {
        // Search for products using shared service
        const productsResult = await productService.searchProducts(
          searchCriteria.query
        );
        const products = productsResult.success
          ? productsResult.data || []
          : [];

        // Apply price filtering if needed
        const filteredProducts = products
          .filter((product) => {
            const price = product.price;
            return (
              (!searchCriteria.minPrice || price >= searchCriteria.minPrice) &&
              (!searchCriteria.maxPrice || price <= searchCriteria.maxPrice)
            );
          })
          .slice(0, 5); // Limit for chat

        // If products found, stream them
        if (filteredProducts && filteredProducts.length > 0) {
          // Send product data through the stream
          dataStream.writeData({
            type: "product",
            products: filteredProducts.map((product) => ({
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
            message: `Found ${filteredProducts.length} products`,
          });

          // Format products for AI context
          const productInfo = formatProductsForAI(filteredProducts);
          const productHtml = createProductHtml(filteredProducts);

          // Create system message with product context
          const systemMessage = createSystemMessage(
            productInfo,
            "" // Don't include HTML in system message
          );

          // Format messages for AI
          const messagesForAI = formatMessagesForAI(messages);

          // Add current message
          messagesForAI.push(createMessage("user", message));

          // Generate AI response and merge into stream
          const result = streamText({
            model: deepseek("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI,
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokensProduct,
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

          const systemMessage = createSystemMessage(
            "No products were found for this search.",
            ""
          );

          const messagesForAI = formatMessagesForAI(messages);
          messagesForAI.push(createMessage("user", message));

          const result = streamText({
            model: deepseek("deepseek-chat"),
            system: systemMessage,
            messages: messagesForAI,
            temperature: AI_CONFIG.temperature,
            maxTokens: AI_CONFIG.maxTokensGeneral,
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
    return createErrorResponse(
      "Failed to process product query",
      "Please try again"
    );
  }
}

/**
 * Handle general chat queries
 */
async function handleGeneralChat(message: string, messages: ChatMessage[]) {
  try {
    // Create system message for general chat
    const systemMessage = createSystemMessage();

    // Format messages for AI
    const messagesForAI = formatMessagesForAI(messages);

    // Add current message
    messagesForAI.push(createMessage("user", message));

    // For general chat, we can use the simpler toDataStreamResponse
    const result = await streamText({
      model: deepseek("deepseek-chat"),
      system: systemMessage,
      messages: messagesForAI,
      temperature: AI_CONFIG.temperature,
      maxTokens: AI_CONFIG.maxTokensGeneral,
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
    return createErrorResponse(
      "Failed to process chat message",
      "Please try again"
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return new Response(
    JSON.stringify({
      message: "Chat API is running",
      endpoints: {
        POST: "/api/chat - Send a chat message",
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
