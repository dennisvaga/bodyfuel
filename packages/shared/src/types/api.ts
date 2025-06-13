export interface PaginationMetadata {
  currentPage: number; // Active page number (1-based)
  totalPages: number; // Total available pages based on itemsPerPage
  totalItems: number; // Total count of items across all pages
  itemsPerPage: number; // Number of items displayed per page
}

export interface ApiResult<T = any> {
  success: boolean; // Operation result status
  data?: T; // Response payload (when success is true)
  message?: string; // Status or error message
  statusCode?: number;
  pagination?: PaginationMetadata; // Optional pagination information
}

export interface PaginationParams {
  currentPage: number; // Current page number (1-based)
  itemsPerPage: number; // Maximum items per page
  filters?: {}; // Other filters
}
