import type { ProductWithImageUrl } from "@repo/database/types/product";
import { constructProductFormData } from "#products/utils/productUtils";
import { fetchData } from "#services/apiClient";
import { FetchMethod } from "#types/enums";
import type { ApiResult, PaginationParams } from "#types/api";
import { ProductFormInput } from "#products/schema/productSchema";
import { constructPaginationQuery } from "#utils/paginationUtils";

export const productService = {
  // * Search products without pagination
  searchProducts: async (
    query?: string
  ): Promise<ApiResult<ProductWithImageUrl[]>> => {
    const searchParams = query ? `?search=${encodeURIComponent(query)}` : "";
    return await fetchData({
      slug: `products/search${searchParams}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  getProducts: async (options?: {
    pagination?: PaginationParams;
    getAllProducts?: boolean;
  }) => {
    let queryParams = options?.pagination
      ? constructPaginationQuery(options.pagination)
      : "";

    if (options?.getAllProducts) {
      queryParams += (queryParams ? "&" : "") + "getAllProducts=true";
    }

    return await fetchData({
      slug: `products?${queryParams}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  getProductBySlug: async (
    slug: string
  ): Promise<ApiResult<ProductWithImageUrl>> => {
    return await fetchData({
      slug: `products/${slug}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  addProduct: async (data: ProductFormInput) => {
    const formData = constructProductFormData(data);

    return await fetchData({
      slug: "admin/products",
      method: FetchMethod.POST,
      body: formData,
      cache: "no-store",
    });
  },

  editProduct: async (productId: number, data: ProductFormInput) => {
    const formData = constructProductFormData(data);

    return await fetchData({
      slug: `admin/products/${productId.toString()}`,
      method: FetchMethod.PUT,
      body: formData,
      cache: "no-store",
    });
  },

  deleteProduct: async (productId: number): Promise<any> => {
    return await fetchData({
      slug: `admin/products/${productId.toString()}`,
      method: FetchMethod.DELETE,
    });
  },
};
