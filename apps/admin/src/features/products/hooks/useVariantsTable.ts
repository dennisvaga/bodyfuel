"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  ExpandedState,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ProductInput, ProductOptionInput, ProductVariantInput } from "@repo/shared";
import { VariantGroupedRows } from "@/src/features/products/types/variants";
import { getVariantsColumns } from "../components/table/variantsColumns";
import { groupVariantsByFirstOption } from "../utils/groupedVariantsUtils";
import { generateAndMergeVariants } from "../utils/variantsUtils";

export function useVariantsTable() {
  const { control, getValues, setValue } = useFormContext<ProductInput>();
  const options: ProductOptionInput[] = useWatch({ control, name: "options" }) || [];
  const variants: ProductVariantInput[] = useWatch({ control, name: "variants" }) || [];

  //  Merges updates to a specific row into the form's variants array
  const updateVariantRowData = useCallback(
    (rowToUpdate: ProductVariantInput, newValues: Partial<ProductVariantInput>) => {
      // getValues is used to get the most up to date data.
      // Watch is async function, don't use it.
      const currentVariants: ProductVariantInput[] = getValues("variants") ?? [];

      const updatedVariants = currentVariants.map((variant) =>
        variant.id.toString() === rowToUpdate.id.toString()
          ? { ...variant, ...newValues }
          : variant
      );

      setValue("variants", updatedVariants);
    },
    [getValues, setValue]
  );

  // Memoize or define columns outside the component
  // so they don't cause re-renders on every keystroke
  const columns = useMemo(
    () => getVariantsColumns(updateVariantRowData),
    [updateVariantRowData]
  );

  useEffect(() => {
    // Save variants to form state
    const generatedVariants = generateAndMergeVariants(options, variants);
    setValue("variants", generatedVariants);
  }, [options]);

  // 3. Re-group variants by first options
  const data = useMemo<VariantGroupedRows[]>(() => {
    return groupVariantsByFirstOption(options, variants);
  }, [options, variants]);

  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { expanded },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.variants, // return the children array as sub-rows
    getExpandedRowModel: getExpandedRowModel(),
  });

  return { table, columns, options };
}

export default useVariantsTable;
