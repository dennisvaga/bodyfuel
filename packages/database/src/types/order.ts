import type { Prisma } from "@prisma/client";
import type { ProductWithImageUrl } from "./product.js";

// fix - Check if you need the product
export type OrderItemWithProduct = Omit<
  Prisma.OrderItemGetPayload<{ include: { product: true } }>,
  "product"
> & {
  product: ProductWithImageUrl;
};

export type OrderWithItems = Omit<
  Prisma.OrderGetPayload<{ include: { shippingInfo: true } }>,
  "orderItems"
> & {
  orderItems: OrderItemWithProduct[];
};
