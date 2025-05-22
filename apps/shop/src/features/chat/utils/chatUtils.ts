/**
 * Utilities for processing and formatting chat messages
 */

/**
 * Cleans HTML content by removing product-related tags and other HTML elements
 * @param content The raw message content that may contain HTML tags
 * @returns Clean text content without HTML tags
 */
export function cleanHtmlContent(content: string): string {
  let cleanedContent = content;

  // Remove product-data tags and their content
  while (/<product-data>[\s\S]*?<\/product-data>/.test(cleanedContent)) {
    cleanedContent = cleanedContent.replace(
      /<product-data>[\s\S]*?<\/product-data>/,
      ""
    );
  }

  // Remove product-stream tags and their content
  while (/<product-stream>[\s\S]*?<\/product-stream>/.test(cleanedContent)) {
    cleanedContent = cleanedContent.replace(
      /<product-stream>[\s\S]*?<\/product-stream>/,
      ""
    );
  }

  // Remove any remaining HTML tags
  return cleanedContent.replace(/<[^>]*>/g, "").trim();
}

/**
 * Type definitions for chat-specific product data
 *
 * These are simplified versions of the database models in @repo/database
 * that include only the fields needed for the chat UI components.
 *
 * @see ProductWithImageUrl in @repo/database/src/types/product.ts for the full model
 */
export interface Product {
  id?: string; // Optional to match data from various sources
  name: string; // Product name (required in DB)
  price: number; // Product price (required in DB)
  description?: string; // Product description (optional in DB)
  imageUrl?: string; // URL for product image (derived from images[] in DB)
  slug: string; // URL slug (required in DB)
}

export interface ExtractedProductData {
  hasProductData: boolean;
  productData?: Product[] | null;
  beforeData?: string | null;
  afterData?: string | null;
}

/**
 * Helper for determining text styles based on message role
 */
export function getMessageStyles(role: string) {
  return {
    textColor: role === "user" ? "text-white" : "text-foreground",
    bgColor: role === "user" ? "bg-primary" : "bg-muted",
    margin: role === "user" ? "ml-8" : "mr-8",
  };
}
