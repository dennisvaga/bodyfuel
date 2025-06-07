import { ContentType, FetchMethod } from "#types/enums";
import type { OrderWithItems } from "@repo/database/types/order";
import { fetchData } from "#services/apiClient";
import type { ApiResult } from "#types/api";
import { OrderInput } from "#orders/schema/orderSchema";

export const orderService = {
  getOrder: async (orderNumber: number): Promise<ApiResult<OrderWithItems>> => {
    return await fetchData({
      slug: `orders/${orderNumber}`,
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  addOrder: async (data: OrderInput) => {
    return await fetchData({
      slug: "orders",
      method: FetchMethod.POST,
      body: JSON.stringify(data),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },

  getUserOrders: async (): Promise<ApiResult<OrderWithItems[]>> => {
    return await fetchData({
      slug: "orders/user",
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },

  getAllOrders: async (): Promise<ApiResult<OrderWithItems[]>> => {
    return await fetchData({
      slug: "admin/orders",
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },
};
