import { PaginationParams } from "#types/api";

export function constructPaginationQuery(pagination: PaginationParams) {
  return new URLSearchParams({
    currentPage: pagination.currentPage.toString(),
    itemsPerPage: pagination.itemsPerPage.toString(),
    ...pagination.filters,
  });
}
