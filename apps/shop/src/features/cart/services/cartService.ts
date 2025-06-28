import type { CartWithItems } from "@repo/database/types/cart";
import { ContentType, FetchMethod } from "@repo/shared";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { fetchData } from "@repo/shared";
import type { ApiResult } from "@repo/shared";

export const cartService = {
  getCart: async (): Promise<ApiResult<CartWithItems>> => {
    return await fetchData({
      slug: "cart",
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  addToCart: async (
    product: ProductWithImageUrl,
    quantity: number = 1,
    variantId?: number | null
  ): Promise<ApiResult<CartWithItems>> => {
    return await fetchData({
      slug: "cart",
      method: FetchMethod.POST,
      body: JSON.stringify({ product, quantity, variantId }),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  changeQuantity: async (
    productId: number,
    quantity: number,
    variantId?: number | null
  ): Promise<ApiResult<CartWithItems>> => {
    return await fetchData({
      slug: "cart",
      method: FetchMethod.PUT,
      body: JSON.stringify({ productId, quantity, variantId }),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  removeFromCart: async (
    productId: number,
    variantId?: number | null
  ): Promise<ApiResult<CartWithItems>> => {
    const queryParams = variantId ? `?variantId=${variantId}` : "";
    return await fetchData({
      slug: `cart/items/${productId}${queryParams}`,
      method: FetchMethod.DELETE,
      cache: "no-store",
    });
  },
};
