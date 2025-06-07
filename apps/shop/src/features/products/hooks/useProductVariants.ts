/**
 * Custom hook for managing product variant selection and calculations
 */

import { useState, useMemo, useEffect } from "react";
import { ProductWithImageUrl } from "@repo/database/types/product";

interface UseProductVariantsProps {
  product: ProductWithImageUrl;
}

interface UseProductVariantsReturn {
  selectedOptions: Record<string, string>;
  selectedVariant: any | null;
  currentPrice: number;
  currentStock: number;
  handleVariantSelection: (optionName: string, value: string) => void;
}

export const useProductVariants = ({
  product,
}: UseProductVariantsProps): UseProductVariantsReturn => {
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // Initialize selected options with first value of each option
  useEffect(() => {
    if (product.options && product.options.length > 0) {
      const initialSelections: Record<string, string> = {};
      product.options.forEach((option) => {
        if (option.optionValues && option.optionValues.length > 0) {
          initialSelections[option.name] = option.optionValues[0].value;
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [product.options]);

  // Find the current selected variant based on selected options
  const selectedVariant = useMemo(() => {
    if (
      !product.variants ||
      product.variants.length === 0 ||
      Object.keys(selectedOptions).length === 0
    ) {
      return null;
    }

    return product.variants.find((variant) => {
      if (!variant.variantOptionValues) return false;

      // Check if all selected options match this variant
      return variant.variantOptionValues.every((vov) => {
        if (!vov.optionValue) return false;

        // Find the option name for this option value
        const option = product.options?.find((opt) =>
          opt.optionValues?.some((ov) => ov.id === vov.optionValue.id)
        );

        if (!option) return false;

        return selectedOptions[option.name] === vov.optionValue.value;
      });
    });
  }, [product, selectedOptions]);

  // Get current price (from variant or base product)
  const currentPrice = selectedVariant?.price ?? product.price ?? 0;

  // Get current stock (from variant or base product)
  const currentStock = selectedVariant?.stock ?? product.quantity ?? 0;

  const handleVariantSelection = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  return {
    selectedOptions,
    selectedVariant,
    currentPrice,
    currentStock,
    handleVariantSelection,
  };
};
