import { ProductVariantOptionValueInput } from "@repo/shared";

/**
 * To represent the variants easier on the screen, the variants grouped under the first
 * option value of the first option. For example, instead of:
 *
 * [x-large, cotton, blue]   [price: ] [stock: ]
 * [x-large, silk,   blue]   [price: ] [stock: ]
 * [x-large, wool,   blue]   [price: ] [stock: ]
 *
 * The structure will be:
 *
 * [x-large]             [price: ] [stock: ]
 *     [cotton, blue]    [price: ] [stock: ]
 *     [silk,   blue]    [price: ] [stock: ]
 *     [wool,   blue]    [price: ] [stock: ]
 *
 */
export type VariantGroupedRows = {
  id: number | string; // Temp uuid
  price: number;
  stock: number;
  // Parent node will have 1 option value
  variantOptionValues?: ProductVariantOptionValueInput[];

  // Nested sub-rows (Recursive structure)
  variants?: VariantGroupedRows[];
};
