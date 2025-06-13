"use client";

import { OrderStatus } from "@repo/database/types/prismaTypes";
import { fetchData } from "@repo/shared";
import { FetchMethod, ContentType } from "@repo/shared";

// Extend the shared order service with admin-specific functionality
export const adminOrderService = {
  // Update order status
  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    return await fetchData({
      slug: `admin/orders/${orderId}/status`,
      method: FetchMethod.PATCH,
      body: JSON.stringify({ status }),
      contentType: ContentType.JSON,
      cache: "no-store",
    });
  },
};
