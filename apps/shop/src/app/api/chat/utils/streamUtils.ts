import { Response as ExpressResponse } from "express";
import { DataStreamWriter } from "ai";
import { ProductData } from "../types/chat.types.js";

/**
 * Sets up Server-Sent Events (SSE) headers for streaming responses
 *
 * Configures the HTTP response headers required for SSE connections,
 * including conversation tracking and product query identification.
 *
 * @param res Express response object to configure
 * @param conversationId Unique identifier for the current conversation
 * @param isProductQuery Whether this response contains product search results
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
 * Copies all headers from a fetch Response to an Express Response
 *
 * @param fromResponse Source fetch Response object
 * @param toResponse Target Express Response object
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
 * Processes a fetch Response stream and pipes it to an Express Response
 *
 * Reads chunks from the fetch Response body stream and writes them
 * to the Express Response, handling completion and error cases.
 *
 * @param response Fetch Response object containing a readable stream
 * @param res Express Response object to write to
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
 * Sends a status update to the client through the data stream
 *
 * Writes a structured status object with type, status code, and message
 * to inform the client about search progress or state changes.
 *
 * @param dataStream AI SDK's data stream writer
 * @param status Status identifier (e.g., "searching", "complete")
 * @param message Human-readable status message
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
 * Sends text content to the client through the data stream
 *
 * @param dataStream AI SDK's data stream writer
 * @param text Content text to send to the client
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
 * Signals completion of the stream to the client
 *
 * Sends a finish event to indicate all data has been transmitted
 * and the client can finalize rendering or processing.
 *
 * @param dataStream AI SDK's data stream writer
 */
export function writeFinishToStream(dataStream: DataStreamWriter): void {
  // Use the dataStream.writeData method instead of direct write
  dataStream.writeData({
    type: "finish",
  });
}

/**
 * Streams product data to the client
 *
 * Sends product search results through the data stream with
 * count information for client-side processing and display.
 *
 * @param dataStream AI SDK's data stream writer
 * @param products Array of product data objects to stream
 * @param productCount Total number of products in the results
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
 * Parses embedded product data from HTML content
 *
 * Extracts JSON-formatted product information embedded within
 * product-data tags in HTML responses from the AI model.
 *
 * @param html HTML string potentially containing product data
 * @returns Parsed array of product data or null if not found/valid
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
