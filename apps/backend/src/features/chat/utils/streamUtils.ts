import { DataStreamWriter } from "ai";

/**
 * Write status update to data stream
 *
 * @param dataStream The data stream writer
 * @param status Status type
 * @param message Status message
 */
export function writeStatusToStream(
  dataStream: DataStreamWriter,
  status: string,
  message: string
): void {
  dataStream.writeData({
    type: "status",
    status,
    message,
  });
}

/**
 * Write products to data stream
 *
 * @param dataStream The data stream writer
 * @param products Array of product data
 * @param count Current product count
 */
export function writeProductsToStream(
  dataStream: DataStreamWriter,
  products: any[],
  count: number
): void {
  dataStream.writeData({
    type: "products",
    products,
    count,
  });
}

/**
 * Write text message to data stream
 *
 * @param dataStream The data stream writer
 * @param text Text content
 */
export function writeTextToStream(
  dataStream: DataStreamWriter,
  text: string
): void {
  dataStream.writeData({
    type: "text",
    content: text,
  });
}

/**
 * Write finish signal to data stream
 *
 * @param dataStream The data stream writer
 */
export function writeFinishToStream(dataStream: DataStreamWriter): void {
  dataStream.writeData({
    type: "finish",
  });
}

/**
 * Extract product data from HTML string
 *
 * @param html HTML string containing product data
 * @returns Array of product objects or null if parsing fails
 */
export function extractProductDataFromHtml(html: string): any[] | null {
  try {
    // Look for product data in JSON format within the HTML
    const productDataMatch = html.match(
      /<product-data>([\s\S]*?)<\/product-data>/
    );

    if (productDataMatch && productDataMatch[1]) {
      const productData = JSON.parse(productDataMatch[1]);
      return Array.isArray(productData) ? productData : [productData];
    }

    return null;
  } catch (error) {
    console.error("Error extracting product data from HTML:", error);
    return null;
  }
}

/**
 * Setup SSE headers for streaming response
 *
 * @param res Response object
 * @param conversationId Conversation ID
 * @param isProductStreaming Whether this is product streaming
 */
export function setupSSEHeaders(
  res: any,
  conversationId: string,
  isProductStreaming: boolean = false
): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
  res.setHeader("X-Conversation-ID", conversationId);

  if (isProductStreaming) {
    res.setHeader("X-Streaming-Products", "true");
  }
}

/**
 * Copy headers from AI SDK response to Express response
 *
 * @param aiResponse AI SDK response
 * @param expressRes Express response
 */
export function copyResponseHeaders(
  aiResponse: Response,
  expressRes: any
): void {
  // Copy relevant headers from AI SDK response
  aiResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "content-length") {
      expressRes.setHeader(key, value);
    }
  });
}

/**
 * Process AI SDK stream and pipe to Express response
 *
 * @param aiResponse AI SDK response
 * @param expressRes Express response
 */
export async function processStreamToResponse(
  aiResponse: Response,
  expressRes: any
): Promise<void> {
  if (!aiResponse.body) {
    throw new Error("No response body available");
  }

  const reader = aiResponse.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // Write the chunk to the Express response
      expressRes.write(value);
    }
  } finally {
    reader.releaseLock();
    expressRes.end();
  }
}
