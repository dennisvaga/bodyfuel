import { z } from "zod";

export const CollectionSchema = z.object({
  id: z.number().optional(), // Needed to adding product
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  products: z
    .array(
      z.object({
        id: z.number(),
      })
    )
    .optional(),
  parentId: z.number().nullable().optional(), // Allow null or undefined for root collections
});

export type CollectionInput = z.infer<typeof CollectionSchema>;
