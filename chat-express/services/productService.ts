import { ProductWithImageUrl } from "@repo/database/types/product";
import { assignImageUrlToProducts } from "../../../services/s3Service.js";
import { ChatbotSearchCriteria, ProductData } from "../types/chat.types.js";
import * as chatRepository from "../repositories/chatRepository.js";

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

  // Process images
  const productsWithOptions = prepareProductsForImageAssignment(products);
  const productsWithUrls = await assignImageUrlToProducts(productsWithOptions);

  return productsWithUrls;
}

/**
 * Prepare products for image URL assignment
 *
 * @param products Array of products
 * @returns Products prepared for assignImageUrlToProducts
 */
export function prepareProductsForImageAssignment(
  products: any[]
): ProductWithImageUrl[] {
  return products.map((product) => ({
    ...product,
    options: [],
    collections: [],
    variants: [],
  })) as unknown as ProductWithImageUrl[];
}

/**
 * Create structured product data for frontend
 *
 * @param productsWithUrls Products with image URLs
 * @returns Structured product data for frontend
 */
export function createStructuredProductData(
  productsWithUrls: any[]
): ProductData[] {
  return productsWithUrls.map((product) => ({
    name: product.name,
    price: product.price,
    description: product.description || "No description available",
    imageUrl:
      product.images && product.images.length > 0
        ? product.images[0].imageUrl
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
  // Prepare the product for image URL assignment
  const productsWithOptions = prepareProductsForImageAssignment([product]);

  // Process images
  const productsWithUrls = await assignImageUrlToProducts(productsWithOptions);

  return productsWithUrls[0];
}

/**
 * Format a single product for streaming
 *
 * @param product The product to format
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
