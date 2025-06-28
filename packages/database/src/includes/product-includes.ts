/**
 * Standardized Prisma include configurations for products
 * Used across all repositories that need product data
 */

export const PRODUCT_BASIC_INCLUDE = {
  images: true,
  options: { include: { optionValues: true } },
  variants: {
    include: { variantOptionValues: { include: { optionValue: true } } },
  },
} as const;

export const PRODUCT_FULL_INCLUDE = {
  ...PRODUCT_BASIC_INCLUDE,
  collections: true,
  category: true,
} as const;

export const PRODUCT_MINIMAL_INCLUDE = {
  images: true,
} as const;
