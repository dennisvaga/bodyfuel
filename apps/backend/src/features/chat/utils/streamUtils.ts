import { Response as ExpressResponse } from "express";
import { DataStreamWriter } from "ai";
import { ProductData } from "../types/chat.types.js";

/**
 * Set up SSE headers for streaming
 *
 * @param res Express response
 * @param conversationId Conversation ID
 * @param isProductQuery Whether this is a product query
 */
export function setupSSEHeaders(
  res: ExpressResponse,
  conversationId: string,
  isProductQuery: boolean = false
): void {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // Disable Nginx buffering

  // Set conversation ID header
  res.setHeader("X-Conversation-Id", conversationId);

  // Set product query header if applicable
  if (isProductQuery) {
    res.setHeader("X-Product-Query", "true");
  }
}

/**
 * Copy headers from one response to another
 *
 * @param fromResponse Source response
 * @param toResponse Target response
 */
export function copyResponseHeaders(
  fromResponse: globalThis.Response,
  toResponse: ExpressResponse
): void {
  // Get headers from the source response
  const headers = fromResponse.headers;

  // Copy each header to the target response
  headers.forEach((value, key) => {
    toResponse.setHeader(key, value);
  });
}

/**
 * Process a stream to an Express response
 *
 * @param response Stream response
 * @param res Express response
 */
export async function processStreamToResponse(
  response: globalThis.Response,
  res: ExpressResponse
): Promise<void> {
  try {
    // Get the body from the response
    const body = response.body;

    if (!body) {
      console.error("No response body");
      res.status(500).end("No response body");
      return;
    }

    // Create a reader from the body
    const reader = body.getReader();

    // Process the stream
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Write the chunk to the response
      res.write(value);
    }

    // End the response
    res.end();
  } catch (error) {
    console.error("Error processing stream:", error);

    // If headers haven't been sent yet, send an error response
    if (!res.headersSent) {
      res.status(500).end("Error processing stream");
    } else {
      // Otherwise just end the response
      res.end();
    }
  }
}

/**
 * Write status to data stream
 *
 * @param dataStream Data stream writer
 * @param status Status code
 * @param message Status message
 */
export function writeStatusToStream(
  dataStream: DataStreamWriter,
  status: string,
  message: string
): void {
  // Use the dataStream.writeData method instead of direct write
  dataStream.writeData({
    type: "status",
    status,
    message,
  });
}

/**
 * Write text to data stream
 *
 * @param dataStream Data stream writer
 * @param text Text to write
 */
export function writeTextToStream(
  dataStream: DataStreamWriter,
  text: string
): void {
  // Use the dataStream.writeData method instead of direct write
  dataStream.writeData({
    type: "text",
    text,
  });
}

/**
 * Write finish to data stream
 *
 * @param dataStream Data stream writer
 */
export function writeFinishToStream(dataStream: DataStreamWriter): void {
  // Use the dataStream.writeData method instead of direct write
  dataStream.writeData({
    type: "finish",
  });
}

/**
 * Write products to data stream
 *
 * @param dataStream Data stream writer
 * @param products Products to write
 * @param productCount Product count
 */
export function writeProductsToStream(
  dataStream: DataStreamWriter,
  products: ProductData[],
  productCount: number
): void {
  // Use the dataStream.writeData method instead of direct write
  dataStream.writeData({
    type: "product", // Match the type expected by the frontend
    products,
    count: productCount,
  });
}

/**
 * Extract product data from HTML
 *
 * @param html HTML string
 * @returns Product data array or null if not found
 */
export function extractProductDataFromHtml(html: string): ProductData[] | null {
  // Extract product data from HTML
  const match = html.match(/<product-data>(.*?)<\/product-data>/s);

  if (match && match[1]) {
    try {
      // Parse the JSON data
      const productData = JSON.parse(match[1]);
      return productData;
    } catch (error) {
      console.error("Error parsing product data:", error);
      return null;
    }
  }

  return null;
}
