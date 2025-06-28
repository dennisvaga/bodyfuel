// This file has been simplified as part of migration to AI SDK built-in streaming
// Most manual streaming utilities are no longer needed

/**
 * Parses embedded product data from HTML content (legacy compatibility)
 *
 * Extracts JSON-formatted product information embedded within
 * product-data tags in HTML responses from the AI model.
 *
 * @param html HTML string potentially containing product data
 * @returns Parsed array of product data or null if not found/valid
 */
export function extractProductDataFromHtml(html: string): any[] | null {
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
