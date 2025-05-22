import { Prisma } from "@prisma/client";
import { ProductWithImageUrl } from "./product.js";

export type Category = Omit<Prisma.CategoryGetPayload<{}>, "products"> & {
  products: ProductWithImageUrl[];
};
