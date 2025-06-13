import { PaginationMetadata } from "@repo/shared";

export function parsePaginationParams(query: any) {
  const currentPage = parseInt(query.currentPage as string) || 1;
  const itemsPerPage = parseInt(query.itemsPerPage as string) || 12;
  const skip = (currentPage - 1) * itemsPerPage;
  return { currentPage, itemsPerPage, skip };
}

export function getPaginationMetaData(
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
): PaginationMetadata {
  return {
    currentPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    totalItems,
    itemsPerPage,
  };
}
