import type { Prisma } from "@prisma/client";
import { ProductWithImageUrl } from "./product.js";

// export const cartIncludes = {
//   productImages: Prisma.validator<Prisma.CartItemInclude>()({
//     product: { include: { images: true } },
//   }),
// };

// Extend the CartItem type to use the extended Product type
export type CartItemWithProduct = Omit<
  Prisma.CartItemGetPayload<{}>,
  "product"
> & {
  product: ProductWithImageUrl;
};

// Extend the Cart type to use the extended CartItem type
export type CartWithItems = Omit<Prisma.CartGetPayload<{}>, "cartItems"> & {
  cartItems: CartItemWithProduct[];
};
