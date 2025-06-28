import type { Prisma } from "@prisma/client";
import type { ProductWithImageUrl, ProductVariant } from "./product.js";

// Extend the CartItem type to use the extended Product type and include variant
export type CartItemWithProduct = Omit<
  Prisma.CartItemGetPayload<{
    include: {
      variant: {
        include: { variantOptionValues: { include: { optionValue: true } } };
      };
    };
  }>,
  "product"
> & {
  product: ProductWithImageUrl;
  variant?: ProductVariant | null;
};

// Extend the Cart type to use the extended CartItem type
export type CartWithItems = Omit<Prisma.CartGetPayload<{}>, "cartItems"> & {
  cartItems: CartItemWithProduct[];
};
