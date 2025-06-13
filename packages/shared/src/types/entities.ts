/**
 * Shared constants for queries and entity types.
 */

export const QUERY_KEYS = {
  PRODUCTS: ["products"],
  PRODUCTS_SEARCH: ["products", "search"],
  PRODUCT: (id: number) => ["product", id],
  PRODUCT_BY_SLUG: (slug: string) => ["product", "slug", slug],
  PRODUCTS_PAGINATED: (params: any) => ["products", "paginated", params],
  COLLECTIONS: ["collections"],
  COLLECTION: (slug: string) => ["collection", slug],
  ORDERS: ["orders"],
  ORDER: (id: number) => ["order", id],
  USER_ORDERS: ["orders", "user"],
  CATEGORY: (slug: string) => ["category", slug],
  CATEGORIES: ["categories"],
  CART: ["cart"],
  COUNTRIES: ["countries"],
};

export enum COLLECTIONS_SLUGS {
  NEW_ARRIVALS = "new-arrivals",
  BEST_SELLERS = "best-sellers",
  SALE_ITEMS = "sale-items",
}

// For both system reference and basic UI display
export enum ENTITY_TYPES {
  PRODUCT = "product",
  COLLECTION = "collection",
  ORDER = "order",
  CHECKOUT = "checkout",
  CONTACT = "contact",
}

// Helper function to get the capitalized label
export function getEntityLabel(type: ENTITY_TYPES): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
