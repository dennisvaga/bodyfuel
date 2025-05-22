import { Prisma } from "@prisma/client";
import { ProductWithImageUrl } from "./product.js";

export type CollectionWithProductsImageUrl = Omit<
  Prisma.CollectionGetPayload<{}>,
  "products"
> & {
  products: ProductWithImageUrl[];
};

export type CollectionWithProducts = Prisma.CollectionGetPayload<{
  include: { products: true };
}>;
