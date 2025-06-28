import { ProductOptionInput, ProductVariantInput } from "@repo/shared";
import { VariantGroupedRows } from "../types/variants";

/**
 * Each group initialized with the first `option value` of the first option
 * @param options
 * @returns
 */
function initGroupedRows(options: ProductOptionInput[]): VariantGroupedRows[] {
  return (
    options[0]?.optionValues.map((ov, index) => ({
      id: `parent-${index}`,
      price: 0,
      stock: 0,
      // Parent will always have only 1 option value.
      variantOptionValues: [
        {
          optionValueId: ov.id,
          optionValue: { id: ov.id, value: ov.value },
        },
      ],

      variants: [], // Nested sub-rows
    })) ?? []
  );
}

/**
 * Find the 'option values' from the first option that matches the group
 * @param group
 * @param variants
 * @returns
 */
function populateVariantGroup(
  group: VariantGroupedRows,
  variants: ProductVariantInput[]
): VariantGroupedRows {
  // Example:
  // Option 1: small, medium, x-large
  // Option 2: red, blue, black
  // Variants: "small/red", "small/blue", "medium/red" ...
  // So we check if first variant option value, match the group option value.
  const matchingVariants = variants.filter(
    (variant) =>
      variant.variantOptionValues?.[0]?.optionValue.value ===
      group.variantOptionValues?.[0]?.optionValue.value
  );

  if (matchingVariants.length) {
    for (const variant of matchingVariants) {
      group.variants?.push({
        id: variant.id,
        price: variant.price,
        stock: variant.stock,
        variantOptionValues: variant.variantOptionValues,
      });
    }
  }

  return group;
}

/**
 * Group variants to easy to read format
 * This is used right before the data is sent to the table.
 * @param variants
 * @param options
 * @returns
 */
export function groupVariantsByFirstOption(
  options: ProductOptionInput[],
  variants: ProductVariantInput[]
): VariantGroupedRows[] {
  let variantRows = initGroupedRows(options);

  // If there is 1 option, avoid nesting further
  if (!options || options?.length <= 1) return variants;

  variantRows = variantRows.map((row) => populateVariantGroup(row, variants));

  return variantRows;
}
