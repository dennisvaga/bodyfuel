import { ChatbotSearchCriteria, StreamProductResponse } from "../chat.types.js";
import * as chatRepository from "../chat.repository.js";
import * as productService from "./chat-product.service.js";
import * as streamUtils from "../utils/stream-utils.js";
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
 */
export async function handleProductStreaming(
  dataStream: DataStreamWriter,
  userMessage: string,
  searchCriteria: ChatbotSearchCriteria
): Promise<number> {
  // Initial status update
  streamUtils.writeStatusToStream(
    dataStream,
    "searching",
    "Searching for products..."
  );

  let productCount = 0;
  let allProducts: any[] = [];

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

        console.log(
          `Streaming product ${productCount}: ${productData[0]?.name} - $${productData[0]?.price}`
        );
      } else {
        console.warn("No product data found in HTML:", productHtml);
      }
    }
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
    streamUtils.writeStatusToStream(
      dataStream,
      "complete",
      `Found ${Math.min(productCount, 5)} products matching your search.`
    );
  }

  return productCount;
}

/**
 * Complete product streaming with a simple response
 *
 * @param dataStream The data stream writer
 * @param productCount The number of products found
 */
export function completeProductStreaming(
  dataStream: DataStreamWriter,
  productCount: number
): void {
  // Create a simple response message
  const responseMessage = createSimpleResponseMessage(5);

  // Write the response as a text part to the data stream
  streamUtils.writeTextToStream(dataStream, responseMessage);

  // Write a finish message part to complete the stream
  streamUtils.writeFinishToStream(dataStream);

  console.log(`Generated response for products: "${responseMessage}"`);
}
