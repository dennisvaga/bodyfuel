"use client";
import React from "react";

import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import AddEditForm from "@/src/components/AddEditForm";
import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import CollectionDetails from "./CollectionDetails";
import { EntitySelection } from "@/src/components/EntitySelection";
import { useCollectionForm } from "../../products/hooks/useCollectionForm";
import { getProductColumns } from "../../products/components/table/productColumns";
import { ENTITY_TYPES } from "@repo/shared";

interface collectionProps {
  collection?: CollectionWithProductsImageUrl;
}

/**
 * Add or Edit Collection
 * This form combines react-hook-form with tanstack table to select collections.
 * @returns
 */
const CollectionForm = ({ collection }: collectionProps) => {
  const {
    form,
    formHeading,
    products,
    categories,
    rowSelection,
    setRowSelection,
    onSubmit,
  } = useCollectionForm(collection);

  return (
    <AddEditForm heading={formHeading} form={form} onSubmit={onSubmit}>
      {/* Children */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          {/* React-hook-form fields */}
          <CollectionDetails></CollectionDetails>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardHeader></CardHeader>
          {/* tanstack table entity selections */}
          <EntitySelection
            entityType={ENTITY_TYPES.PRODUCT}
            entityData={products}
            columns={getProductColumns(categories).filter((col: any) =>
              ["name", "images", "categoryId"].includes(col.accessorKey)
            )}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </CardContent>
      </Card>
    </AddEditForm>
  );
};

export default CollectionForm;
