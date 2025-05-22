"use client";

import React from "react";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import ProductOptions from "./ProductOptions";
import ProductDetails from "./ProductDetails";
import AddEditForm from "@/src/components/AddEditForm";
import { EntitySelection } from "@/src/components/EntitySelection";
import { useProductForm } from "../hooks/useProductForm";
import VariantsTable from "./table/VariantsTable";
import { collectionColumns } from "@/src/features/collections/components/table/collectionColumns";
import { ENTITY_TYPES } from "@repo/shared";

// Existing product to update
interface props {
  product?: ProductWithImageUrl;
}

/**
 * Add or Edit product
 */
const ProductForm = ({ product }: props) => {
  const {
    form,
    collections,
    formHeading,
    onSubmit,
    rowSelection,
    setRowSelection,
    fileInputRef,
  } = useProductForm(product);

  return (
    <AddEditForm heading={formHeading} form={form} onSubmit={onSubmit}>
      {/* Product Details */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          <ProductDetails fileInputRef={fileInputRef}></ProductDetails>
        </CardContent>
      </Card>
      {/* Product Collections */}
      <Card>
        <CardContent>
          <CardHeader> Collections </CardHeader>
          <EntitySelection
            entityType={ENTITY_TYPES.COLLECTION}
            entityData={collections}
            // Add only name column
            columns={collectionColumns.filter((col: any) =>
              ["name"].includes(col.accessorKey)
            )}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </CardContent>
      </Card>
      {/* Product Variants + Options */}
      <Card>
        <CardHeader> Variants </CardHeader>
        <CardContent className="flex flex-col gap-10">
          <ProductOptions></ProductOptions>
        </CardContent>
        <VariantsTable></VariantsTable>
      </Card>
    </AddEditForm>
  );
};

export default ProductForm;
