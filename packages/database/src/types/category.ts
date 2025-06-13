import type { Prisma } from "@prisma/client";
import type { ProductWithImageUrl } from "./product.js";

export type Category = Omit<Prisma.CategoryGetPayload<{}>, "products"> & {
  products: ProductWithImageUrl[];
};
