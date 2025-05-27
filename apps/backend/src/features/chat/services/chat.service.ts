import {
  ChatbotSearchCriteria,
  StreamProductResponse,
  ChatMessage,
} from "../chat.types.js";
import * as chatRepository from "../chat.repository.js";
import * as productService from "./chat-product.service.js";
import * as streamUtils from "../utils/stream-utils.js";
import * as conversationService from "./conversation.service.js";
import { DataStreamWriter } from "ai";
import { createSimpleResponseMessage } from "../utils/message-utils.js";

/**
 * Stream products based on search criteria
 *
 * @param userMessage The user's message
 * @param searchCriteria The search criteria
 * @returns AsyncGenerator that yields product info and HTML
 */
export async function* streamProductSearch(
  userMessage: string,
  searchCriteria: ChatbotSearchCriteria
): AsyncGenerator<StreamProductResponse, void, unknown> {
  const { searchQuery, targetPrice } = searchCriteria;

  if (!searchQuery) {
    yield {
      productInfo: "No search query found in the message.\n\n",
      productHtml: "",
      isStreaming: false,
    };
    return;
  }

  try {
    // Use the streamProducts function to get products one by one
    const productGenerator = chatRepository.streamProducts(searchCriteria);

    let productCount = 0;
    let allProducts: any[] = [];

    // Process each product as it comes in
    for await (const product of productGenerator) {
      productCount++;
      allProducts.push(product);

      // Format this individual product for streaming
      const { productInfo, productHtml } =
        await productService.formatProductForStreaming(
          product,
          searchQuery,
          targetPrice
        );

      console.log(`Streaming product ${productCount}: ${product.name}`);

      // Yield the current product with streaming flag
      yield {
        productInfo,
        productHtml,
        isStreaming: true,
      };

      // Add a small delay to ensure frontend can process each product
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (productCount === 0) {
      yield {
        productInfo: `No products found matching the query "${searchQuery}"${targetPrice !== undefined ? ` around $${targetPrice.toFixed(2)}` : ""}.\n\n`,
        productHtml: "",
        isStreaming: false,
      };
    } else {
      // Send a final message to indicate all products have been streamed
      yield {
        productInfo: `Found ${productCount} products matching "${searchQuery}"${targetPrice !== undefined ? ` around $${targetPrice.toFixed(2)}` : ""}.\n\n`,
        productHtml: "",
        isStreaming: false,
      };
    }
  } catch (error) {
    console.error("Error streaming products:", error);
    yield {
      productInfo: "An error occurred while searching for products.\n\n",
      productHtml: "",
      isStreaming: false,
    };
  }
}

/**
 * Handle product streaming to data stream
 *
 * @param dataStream The data stream writer
 * @param userMessage The user's message
 * @param searchCriteria The search criteria
 * @param conversationId Optional conversation ID to save product info
 */
export async function handleProductStreaming(
  dataStream: DataStreamWriter,
  userMessage: string,
  searchCriteria: ChatbotSearchCriteria,
  conversationId?: string
): Promise<number> {
  // Initial status update
  streamUtils.writeStatusToStream(
    dataStream,
    "searching",
    "Searching for products..."
  );

  let productCount = 0;
  let allProducts: any[] = [];
  let productMessages: ChatMessage[] = []; // Collect all product messages

  // Process each product as it comes in
  const productGenerator = streamProductSearch(userMessage, searchCriteria);

  for await (const {
    productInfo,
    productHtml,
    isStreaming,
  } of productGenerator) {
    if (isStreaming && productHtml) {
      // Extract the product data from the HTML
      const productData = streamUtils.extractProductDataFromHtml(productHtml);

      if (productData) {
        productCount++;

        // Add to all products (for final response)
        allProducts = [...allProducts, ...productData];

        // Stream ONLY this product to the client immediately
        streamUtils.writeProductsToStream(
          dataStream,
          productData,
          productCount
        );

        // Collect product message instead of saving immediately
        if (conversationId) {
          const productMessage: ChatMessage = {
            role: "assistant",
            content: productHtml, // Save the HTML directly
          };

          productMessages.push(productMessage);

          console.log(
            `Collected product message ${productCount} for conversation ${conversationId}. HTML length: ${productHtml.length}`
          );
        }

        console.log(
          `Streaming product ${productCount}: ${productData[0]?.name} - $${productData[0]?.price}`
        );
      } else {
        console.warn("No product data found in HTML:", productHtml);
      }
    }
  }

  // Save all product messages at once to avoid race conditions
  if (conversationId && productMessages.length > 0) {
    console.log(
      `Saving ${productMessages.length} product messages to conversation ${conversationId}`
    );

    // Show conversation state before
    const conversationBefore =
      conversationService.getConversation(conversationId);
    console.log(
      `Conversation before save: ${conversationBefore ? conversationBefore.messages.length : "NOT_FOUND"} messages`
    );

    conversationService.addMessages(conversationId, productMessages);

    // Add summary message
    const summaryMessage = conversationService.createProductStreamSummary(
      productCount,
      searchCriteria.searchQuery
    );
    conversationService.addMessage(conversationId, summaryMessage);

    console.log(
      `Successfully saved ${productMessages.length} products and summary to conversation ${conversationId}`
    );

    // Verify the conversation was updated
    const conversation = conversationService.getConversation(conversationId);
    if (conversation) {
      console.log(
        `Conversation ${conversationId} now has ${conversation.messages.length} total messages`
      );
      // Show debug info
      conversationService.debugConversations();
    } else {
      console.error(`Conversation ${conversationId} not found after save!`);
    }
  } else {
    console.log(
      `No products to save: conversationId=${conversationId}, productMessages.length=${productMessages.length}`
    );
  }

  // If no products were found, send a message saying so
  if (productCount === 0) {
    streamUtils.writeStatusToStream(
      dataStream,
      "no-results",
      "No products found matching your query."
    );
  } else {
    // Signal that all products have been found with a clear "complete" status
    const statusMessage = `Found ${Math.min(productCount, 5)} products matching your search.`;
    streamUtils.writeStatusToStream(dataStream, "complete", statusMessage);
  }

  return productCount;
}

/**
 * Complete product streaming with a simple response
 *
 * @param dataStream The data stream writer
 * @param productCount The number of products found
 * @param conversationId Optional conversation ID to save the product info
 * @param productInfo Optional product information to save to the conversation
 */
export function completeProductStreaming(
  dataStream: DataStreamWriter,
  productCount: number,
  conversationId?: string,
  productInfo?: string
): void {
  // Create a simple response message
  const responseMessage = createSimpleResponseMessage(5);

  // Write the response as a text part to the data stream
  streamUtils.writeTextToStream(dataStream, responseMessage);

  // Write a finish message part to complete the stream
  streamUtils.writeFinishToStream(dataStream);

  console.log(`Generated response for products: "${responseMessage}"`);
}

/**
 * Test function to verify product streaming persistence
 */
export function testProductStreamPersistence(): void {
  console.log("=== Testing Product Stream Persistence ===");

  // Create test conversation
  const testConvId = "test_conv_123";
  const testConversation = conversationService.handleConversation(testConvId, [
    { role: "user", content: "Show me some protein powder" },
  ]);

  console.log(`Created test conversation: ${testConversation.id}`);

  // Create test product messages
  const testProductMessages: ChatMessage[] = [
    { role: "assistant", content: "<div>Product 1 HTML</div>" },
    { role: "assistant", content: "<div>Product 2 HTML</div>" },
    { role: "assistant", content: "<div>Product 3 HTML</div>" },
  ];

  console.log(`Adding ${testProductMessages.length} test product messages...`);

  // Test batch adding
  conversationService.addMessages(testConvId, testProductMessages);

  // Add summary
  const summary = conversationService.createProductStreamSummary(
    3,
    "protein powder"
  );
  conversationService.addMessage(testConvId, summary);

  // Verify results
  const finalConversation = conversationService.getConversation(testConvId);
  if (finalConversation) {
    console.log(
      `Final conversation has ${finalConversation.messages.length} messages`
    );
    finalConversation.messages.forEach((msg, index) => {
      console.log(
        `  ${index + 1}. ${msg.role}: ${msg.content.substring(0, 50)}...`
      );
    });
  }

  console.log("=== End Test ===");
}

/**
 * Debug endpoint to see current conversations
 */
export function getDebugConversations(): any {
  return conversationService.debugConversations();
}

/**
 * Debug endpoint to get a specific conversation
 */
export function getDebugConversation(conversationId: string): any {
  return conversationService.getConversation(conversationId);
}
