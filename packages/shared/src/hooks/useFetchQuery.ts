"use client";

import type { ApiResult } from "#types/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type FetchQueryProps<T> = {
  queryKey: any[];
  serviceFn: () => Promise<ApiResult<T>>;
  options?: Partial<UseQueryOptions<ApiResult<T>, Error>>;
};

/**
 * A wrapper around useQuery that adds additional functionality.
 * Note: This useFetchQuery wrapper work only internally, because it expect our return type with ApiResult
 * This hook:
 * - Calls our API Client and throws error when success is false
 * - Checks the success field from our API responses
 * - Restructures the return value to avoid nested data.data access
 *
 * @returns An enhanced useQuery result with:
 *  - data: Direct access to response payload (response.data)
 *  - pagination: Direct access to pagination info if present
 *  - apiResponse: Access to the complete ApiResult object when needed
 */
export const useFetchQuery = <T>({ queryKey, serviceFn, options }: FetchQueryProps<T>) => {
  const query = useQuery<ApiResult<T>, Error>({
    queryKey,
    queryFn: async () => {
      const response = await serviceFn();
      if (!response.success || !response.data) {
        throw new Error(response.message);
      }
      return response;
    },
    staleTime: 1000 * 60 * 10, // Default cache time of 10 minutes
    ...options,
  });
  // Return a restructured result to avoid data.data nested issue
  return {
    ...query,
    apiResponse: query.data,
    data: query.data?.data,
    pagination: query.data?.pagination,
  };
};
