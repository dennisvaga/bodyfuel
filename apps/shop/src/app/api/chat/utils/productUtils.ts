import type { ProductWithImageUrl } from "@repo/database/types/product";

/**
 * Format products for AI context
 */
export function formatProductsForAI(products: ProductWithImageUrl[]): string {
  if (!products || products.length === 0) {
    return "No products found matching the criteria.";
  }

  return products
    .map((product, index) => {
      return `${index + 1}. ${product.name} - $${product.price} - ${product.description || "No description available"}`;
    })
    .join("\n");
}

/**
 * Create product HTML for streaming
 */
export function createProductHtml(products: ProductWithImageUrl[]): string {
  if (!products || products.length === 0) {
    return "";
  }

  return products
    .map((product) => {
      const imageUrl = product.images?.[0]?.imageUrl || "/media/blankImage.jpg";
      return `<div class="product-card" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${imageUrl}" data-slug="${product.slug}"></div>`;
    })
    .join("");
}
