import type { Prisma } from "@prisma/client";

// Extend the ProductImage type to include imageUrl
type ProductImageWithUrl = Prisma.ProductImageGetPayload<{}> & {
  imageUrl: string;
};

// Extend the Product type to use the extended ProductImage type
export type ProductWithImageUrl = Omit<
  Prisma.ProductGetPayload<{
    include: {
      // images: true;
      options: { include: { optionValues: true } };
      variants: {
        include: { variantOptionValues: { include: { optionValue: true } } };
      };
      collections: true;
    };
  }>,
  "images"
> & {
  images: ProductImageWithUrl[];
};

// type ProductOptions = Prisma.ProductOptionGetPayload<{ include: { optionValues: true } }>;

export type ProductVariant = Prisma.ProductVariantGetPayload<{
  include: {
    variantOptionValues: {
      include: {
        optionValue: {
          include: { option: true };
        };
      };
    };
  };
}>;

// export type ProductOption = Prisma.ProductOptionGetPayload<{
//   include: { optionValues: true };
// }>;
