import { fetchData } from "#services/apiClient";
import type { ApiResult } from "#types/api";
import type { Category } from "@repo/database/types/category";
import { FetchMethod } from "#types/enums";

export const categoryService = {
  getCategoriesNames: async (): Promise<ApiResult<Category[]>> => {
    return await fetchData({
      slug: "categories",
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  getCategoryWithProducts: async (slug: string): Promise<ApiResult<Category>> => {
    return await fetchData({
      slug: `categories/${slug}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },
};
