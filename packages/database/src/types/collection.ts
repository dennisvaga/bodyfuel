import type { Prisma } from "@prisma/client";
import type { ProductWithImageUrl } from "./product.js";

export type CollectionWithProductsImageUrl = Omit<
  Prisma.CollectionGetPayload<{}>,
  "products"
> & {
  products: ProductWithImageUrl[];
};

export type CollectionWithProducts = Prisma.CollectionGetPayload<{
  include: { products: true };
}>;
