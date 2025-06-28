import { CollectionSchema } from "#collections/schema/CollectionSchema";
import { z } from "zod";

// Temporary uuid is used across the schemas, to track which new to add,
// and for overall consistency.

const ProductOptionValueSchema = z.object({
  id: z.union([z.number(), z.string()]),
  value: z.string().min(1, "value is required"),
});

export const ProductOptionSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().min(1, "Name is required"),
  optionValues: z.array(ProductOptionValueSchema),
  added: z.boolean().optional(),
});

// Join table
const ProductVariantOptionValueSchema = z.object({
  optionValueId: z.union([z.number(), z.string()]),
  optionValue: ProductOptionValueSchema.partial(),
});

export const ProductVariantSchema = z.object({
  id: z.union([z.number(), z.string()]),
  price: z.number(),
  stock: z.number().int(),
  variantOptionValues: z.array(ProductVariantOptionValueSchema).optional(),
});

// Backend validation
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  brand: z.string().optional(),
  categoryId: z.coerce.number().min(1, "Category is required"),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  collections: z.array(CollectionSchema).optional(),
  options: z.array(ProductOptionSchema).optional(),
  variants: z.array(ProductVariantSchema).optional(),
});

// Frontend validation
export const productFormSchema = productSchema.extend({
  images: z
    .array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: "File must be an image",
      })
    )
    .optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

export type ProductFormInput = z.infer<typeof productFormSchema>;

export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;

export type ProductOptionInput = z.infer<typeof ProductOptionSchema>;

export type ProductVariantOptionValueInput = z.infer<typeof ProductVariantOptionValueSchema>;
