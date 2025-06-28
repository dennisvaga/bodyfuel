import { ChatbotSearchCriteria, ProductData } from "@repo/shared";
import * as chatRepository from "../chat.repository.js";

/**
 * Search for products based on search criteria
 *
 * @param criteria The search criteria
 * @returns Array of products with image URLs
 */
export async function searchProducts(
  criteria: ChatbotSearchCriteria
): Promise<any[]> {
  // Use the repository to find products
  const products = await chatRepository.findProducts(criteria);
  return products;
}

/**
 * Create structured product data for frontend
 *
 * @param products Products array (should already have imageUrl from S3 service)
 * @returns Structured product data for frontend
 */
export function createStructuredProductData(products: any[]): ProductData[] {
  return products.map((product) => ({
    name: product.name,
    price: product.price,
    description: product.description || "No description available",
    imageUrl:
      product.images && product.images.length > 0
        ? product.images[0].imageUrl || "/media/blankImage.jpg"
        : "/media/blankImage.jpg",
    slug: product.slug,
  }));
}

/**
 * Create product HTML for frontend
 *
 * @param productData Structured product data
 * @returns HTML string for frontend
 */
export function createProductHtml(productData: ProductData[]): string {
  // Always use the same format for product data
  return `<product-data>${JSON.stringify(productData)}</product-data>`;
}

/**
 * Format product information for AI context
 *
 * @param products Array of products
 * @param searchQuery The search query used
 * @param targetPrice The target price (optional)
 * @returns Formatted product information as a string
 */
export function formatProductInfoForAI(
  products: any[],
  searchQuery: string,
  targetPrice?: number
): string {
  if (products.length === 0) {
    return `No products found matching the query "${searchQuery}"${targetPrice !== undefined ? ` around $${targetPrice.toFixed(2)}` : ""}.\n\n`;
  }

  let productInfo = `Here are some products that match the query "${searchQuery}"${targetPrice !== undefined ? ` around $${targetPrice.toFixed(2)}` : ""}:\n\n`;

  // Add product info to the AI context
  products.forEach((product, index) => {
    productInfo += `${index + 1}. ${product.name} - $${product.price.toFixed(2)}\n`;
    productInfo += `   Description: ${product.description || "No description available"}\n`;
    if (product.category) {
      productInfo += `   Category: ${product.category.name}\n`;
    }
    productInfo += `   Slug: ${product.slug}\n\n`;
  });

  return productInfo;
}

/**
 * Process a single product for streaming
 *
 * @param product The product to process
 * @returns Processed product with image URL
 */
export async function processProductForStreaming(product: any): Promise<any> {
  // For now, just return the product as-is since we're not using S3 service
  // In the future, this could be enhanced to process images
  return product;
}

/**
 * Format a single product for streaming
 *
 * @param product The product to format
 * @param searchQuery The search query used
 * @param targetPrice The target price (optional)
 * @returns Formatted product data and HTML
 */
export async function formatProductForStreaming(
  product: any,
  searchQuery: string,
  targetPrice?: number
): Promise<{ productInfo: string; productHtml: string }> {
  try {
    // Process the product
    const processedProduct = await processProductForStreaming(product);

    // Create structured data for the frontend
    const productData = createStructuredProductData([processedProduct]);

    // Create HTML for frontend
    const productHtml = createProductHtml(productData);

    // Create product info for AI
    const productInfo = formatProductInfoForAI(
      [processedProduct],
      searchQuery,
      targetPrice
    );

    return { productInfo, productHtml };
  } catch (error) {
    console.error("Error formatting product for streaming:", error);
    return {
      productInfo: "Error processing product information.",
      productHtml: "",
    };
  }
}
