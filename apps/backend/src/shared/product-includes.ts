/**
 * Standardized Prisma include configurations for products
 * This ensures consistency across all repositories and prevents missing includes
 */

export const PRODUCT_FULL_INCLUDE = {
  images: true,
  options: { include: { optionValues: true } },
  variants: {
    include: { variantOptionValues: { include: { optionValue: true } } },
  },
  collections: true,
  category: true,
} as const;

export const PRODUCT_BASIC_INCLUDE = {
  images: true,
  options: { include: { optionValues: true } },
  variants: {
    include: { variantOptionValues: { include: { optionValue: true } } },
  },
} as const;

export const PRODUCT_MINIMAL_INCLUDE = {
  images: true,
} as const;

export const PRODUCT_VARIANTS_ONLY = {
  options: { include: { optionValues: true } },
  variants: {
    include: { variantOptionValues: { include: { optionValue: true } } },
  },
} as const;
