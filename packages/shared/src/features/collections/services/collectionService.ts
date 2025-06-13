import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import { CollectionInput } from "#collections/schema/CollectionSchema";
import { fetchData } from "#services/apiClient";
import { ContentType, FetchMethod } from "#types/enums";
import type { ApiResult, PaginationParams } from "#types/api";
import { constructPaginationQuery } from "#utils/paginationUtils";

// * Fetching includes products
export const collectionService = {
  getCollectionBySlug: async (
    slug: string,
    pagination?: PaginationParams
  ): Promise<ApiResult<CollectionWithProductsImageUrl>> => {
    let queryParams = pagination ? constructPaginationQuery(pagination) : "";

    return await fetchData({
      slug: `collections/${slug}?${queryParams}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  getCollections: async (options?: {
    pagination?: PaginationParams;
    includeProducts?: boolean;
  }): Promise<ApiResult<CollectionWithProductsImageUrl[]>> => {
    let queryParams = options?.pagination
      ? constructPaginationQuery(options.pagination)
      : "";

    if (options?.includeProducts) {
      queryParams += (queryParams ? "&" : "") + "includeProducts=true";
    }

    return await fetchData({
      slug: `collections?${queryParams}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },
  addCollection: async (data: CollectionInput) => {
    return await fetchData({
      slug: "admin/collections",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  editCollection: async (collectionId: number, data: CollectionInput) => {
    return await fetchData({
      slug: `admin/collections/${collectionId.toString()}`,
      method: FetchMethod.PUT,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  deleteCollection: async (
    collectionId: number
  ): Promise<ApiResult<CollectionWithProductsImageUrl>> => {
    return await fetchData({
      slug: `admin/collections/${collectionId.toString()}`,
      method: FetchMethod.DELETE,
      cache: "no-store",
    });
  },
};
