// ------ Categories -------------------------------------------------------------
export * from "./features/categories/utils/categoriesUtils.js";
export * from "./features/categories/services/categoryService.js";

// ------ Collections ------------------------------------------------------------
export * from "./features/collections/schema/CollectionSchema.js";
export * from "./features/collections/types/collectionEnum.js";
export * from "./features/collections/services/collectionService.js";

// ------ Orders -----------------------------------------------------------------
export * from "./features/orders/schema/orderSchema.js";
export * from "./features/orders/services/orderService.js";

// Order utilities
export * from "./features/orders/utils/formatters.js";
export * from "./features/orders/utils/orderColumnUtils.js";
// Rename export for backward compatibility
export { formatOrderCurrency as formatCurrency } from "./features/orders/utils/formatters.js";

// ------ Products ---------------------------------------------------------------
export * from "./features/products/schema/productSchema.js";
export * from "./features/products/types/productEnums.js";
export * from "./features/products/utils/productUtils.js";
export * from "./features/products/services/productService.js";

// ------ Contact ----------------------------------------------------------------
export * from "./features/contact/schema/contactSchema.js";

// ------ Chat -------------------------------------------------------------------
export * from "./features/chatbot/schemas/chatSchema.js";
export * from "./features/chatbot/types/chatTypes.js";

// ------ Shared Utilities & Hooks -----------------------------------------------
// hooks
export * from "./hooks/useFetchQuery.js";
export * from "./hooks/useformUtils.js";

// services
export { fetchData, fetchStreamingData } from "./services/apiClient.js";
export * from "./services/countryService.js";
// types
export * from "./types/api.js";
export * from "./types/enums.js";
export * from "./types/entities.js";
export * from "./types/ui.js";
// utils
export * from "./utils/onErrors.js";
export * from "./utils/zodUtils.js";
export * from "./utils/storageUtils.js";
export * from "./utils/featureFlags.js";

// Commented out to avoid duplicate export with orders/utils/formatters.js
// export * from "./utils/formatters.js";
