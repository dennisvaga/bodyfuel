"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@repo/ui/components/ui/input";
import React, { HTMLProps, useEffect, useRef } from "react";
import { VariantGroupedRows } from "../../types/variants";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";

/**
 * Custom component
 * @param param0
 * @returns
 */
const CurrencyInput = ({
  value,
  isDisabled = false,
  onChange,
  placeholder = "0",
}: {
  value?: number;
  isDisabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) => {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3">$</span>
      <Input
        className="pl-8 font-medium"
        placeholder={placeholder}
        disabled={isDisabled}
        value={value}
        onChange={onChange}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
        type="number"
        step="0.01"
        min="0"
      />
    </div>
  );
};

/**
 * From tanstack example
 */
function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

export const getVariantsColumns = (updateVariantRowData: Function) => {
  const variantsColumns: ColumnDef<VariantGroupedRows>[] = [
    {
      id: "variantOptionValues",
      accessorFn: (row) => {
        // Parent
        // one 'option value' mean it shouldn't be nested either.
        if (row.variants || row.variantOptionValues?.length === 1) {
          return row.variantOptionValues?.[0]?.optionValue?.value || "Parent";
        }

        // Child
        const optionValues = row.variantOptionValues
          ?.map((v) => v.optionValue.value)
          .slice(1)
          .join(", ");
        return optionValues;
      },
      header: ({ table }) => (
        <div className="whitespace-nowrap">
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="cursor-auto"
          />
          <Label> Variant · </Label>
          <Button
            variant="ghost"
            type="button"
            className="hover:bg-transparent"
            onClick={table.getToggleAllRowsExpandedHandler()}
          >
            {table.getIsAllRowsExpanded() ? "Collapse all" : "Expand all"}
          </Button>
        </div>
      ),
      cell: ({ row, getValue }) => {
        return (
          // Since rows are flattened by default, we use the row.depth property
          // and paddingLeft to visually indicate the depth of the row
          <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />{" "}
            {getValue<string>()}
          </div>
        );

        return null; // Hide parent row when no variants exist
      },
    },
    {
      accessorFn: (row) => row.price,
      id: "price",
      header: () => <div>Price</div>,
      cell: ({ row, table }) => {
        // Price difference
        // 'row.original.variants' check if there is nested rows
        if (row.original.variants) {
          const childPrices = row
            .getLeafRows()
            .filter((tableRow) => row.id === tableRow.parentId)
            .map((tableRow) => tableRow.original.price);

          const minPrice = Math.min.apply(null, childPrices);
          const maxPrice = Math.max.apply(null, childPrices);

          // Display decimals when they exist
          const formattedMinPrice =
            minPrice % 1 === 0 ? minPrice.toString() : minPrice.toFixed(2);
          const formattedMaxPrice =
            maxPrice % 1 === 0 ? maxPrice.toString() : maxPrice.toFixed(2);

          return (
            <CurrencyInput
              placeholder={`${formattedMinPrice}-${formattedMaxPrice}`}
              onChange={(e) => {
                const price = parseFloat(e.target.value) || 0;
                const childRows = table
                  .getRowModel()
                  .flatRows.filter((tableRow) => row.id === tableRow.parentId);
                childRows.map((row) => {
                  updateVariantRowData(row.original, { price: price });
                });
              }}
            />
          );
        }
        // Regular input (nested children or parent with 1 option)
        return (
          <CurrencyInput
            value={row.original.price ?? 0}
            onChange={(e) => {
              const newPrice = parseFloat(e.target.value) || 0;
              updateVariantRowData(row.original, { price: newPrice });
            }}
          />
        );
      },
    },
    {
      accessorFn: (row) => row.stock,
      id: "stock",
      header: () => <div>Stock</div>,
      cell: ({ row }) => {
        // Total stock
        // 'row.original.variants' check if there is nested rows
        if (row.original.variants) {
          const childStockTotal = row
            .getLeafRows()
            .reduce(
              (accumulator, currentRow) =>
                accumulator + (currentRow.original.stock ?? 0),
              0
            );

          return (
            <Input
              className="font-medium"
              value={childStockTotal ?? 0}
              disabled={true}
            />
          );
        }
        // Regular input (nested children or parent with 1 option)
        return (
          <Input
            className="font-medium"
            value={row.original.stock ?? 0}
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newStock = parseInt(e.target.value, 10) || 0;
              updateVariantRowData(row.original, { stock: newStock });
            }}
          />
        );
      },
    },
  ];

  return variantsColumns;
};
