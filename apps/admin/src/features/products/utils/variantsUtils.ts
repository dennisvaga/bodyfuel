import { ProductOptionInput, ProductVariantInput } from "@repo/shared";
import { v4 as uuidv4 } from "uuid";

/**
 * Create a mapping of option values to their IDs,
 * to connect the `option value` id back after the generation
 */
function createOptionValueMap(options: ProductOptionInput[]): Record<string, { id: string }> {
  const idMap: Record<string, { id: string }> = {};

  options.forEach((option) => {
    option.optionValues.forEach(({ value, id }) => {
      idMap[value] = { id: id.toString() };
    });
  });

  return idMap;
}

/**
 * Generate all possible combinations of `option values`
 */
function generateCombinations(options: ProductOptionInput[]): string[][] {
  // Start with an empty combination
  let combinations: string[][] = [[]];

  options.forEach((option) => {
    // Temporary array to hold updated combinations
    const updatedCombinations: string[][] = [];

    option.optionValues.forEach(({ value }) => {
      // Iterate over each existing combination and append the new value
      combinations.forEach((existingCombo) => {
        updatedCombinations.push([...existingCombo, value]);
      });
    });

    // Replace the old combinations with the updated ones
    combinations = updatedCombinations;
  });

  return combinations;
}

/**
 * Build variant objects from generated combinations, while preserving the
 * option values id's.
 * @param options
 * @returns
 */
const buildVariantObjects = (options: ProductOptionInput[]): ProductVariantInput[] => {
  const idMap = createOptionValueMap(options);
  // optional - add validation that all combinations are unique
  const combinations = generateCombinations(options);

  // Map combinations to final Variant objects
  return (
    combinations.map((combination: string[]) => ({
      id: uuidv4(),
      price: 0,
      stock: 0,
      variantOptionValues: combination.map((val: string) => ({
        optionValueId: idMap[val]?.id ?? "",
        optionValue: { value: val },
      })),
    })) ?? []
  );
};

/**
 * This is a curical function that needed to preserve stock and price.
 * without this function, the price and stock will be lost.
 * This function needed in
 * @param generatedVariants new generated variants
 * @param existingVariants exsiting variants from the DB
 * @returns
 */
function mergeExistingVariants(
  generatedVariants: ProductVariantInput[],
  existingVariants: ProductVariantInput[]
) {
  //  Merge with existing variants
  return generatedVariants.map((generatedVariant) => {
    // Find existing variant
    const matchedVariant = existingVariants.find((existingVariant) => {
      // Construct object to simplify comparison
      const existingValues =
        existingVariant.variantOptionValues?.map((v) => ({
          optionValue: { value: v.optionValue?.value ?? "" },
        })) ?? [];

      const generatedValues = generatedVariant.variantOptionValues?.map((v) => ({
        optionValue: { value: v.optionValue?.value ?? "" },
      }));

      return isSameCombination(existingValues, generatedValues || []);
    });

    // If a match is found, preserve price, stock and id
    return matchedVariant ? matchedVariant : generatedVariant;
  });
}

/**
 * Find the variant with the same 'option values'
 */
function isSameCombination(
  comboA: { optionValue: { value: string } }[],
  comboB: { optionValue: { value: string } }[]
): boolean {
  if (comboA.length !== comboB.length) return false;

  const valuesA = comboA.map((c) => c.optionValue.value).sort();
  const valuesB = comboB.map((c) => c.optionValue.value).sort();

  return JSON.stringify(valuesA) === JSON.stringify(valuesB);
}

/**
 * Main entry point.
 *
 * 1. Generate new combinations,
 * 2. Merges with existing variants to preserve price and stock data
 *
 * Important: At the DataBase level, we delete all variants and recreate them.
 * so there is no need to preserve real id.
 * @param options
 * @param existingVariants
 * @returns
 */
export function generateAndMergeVariants(
  options: ProductOptionInput[] | undefined,
  existingVariants?: ProductVariantInput[]
): ProductVariantInput[] | undefined {
  // If no options, nothing to generate
  if (!options || options.length === 0) {
    return [];
  }

  // Generate all in both cases
  const generatedVariants = buildVariantObjects(options);

  // If there's no existing variants, return the generated combos
  if (!existingVariants) return generatedVariants;

  const mergedVariants = mergeExistingVariants(generatedVariants, existingVariants);

  // Else, merge with exsiting variants
  return mergedVariants;
}
