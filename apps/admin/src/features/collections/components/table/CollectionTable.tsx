"use client";

import { collectionService, ENTITY_TYPES, QUERY_KEYS } from "@repo/shared";
import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import { ColumnDef, Row } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { collectionColumns } from "./collectionColumns";
import { useFetchQuery } from "@repo/shared";
import { DataTable } from "@/src/components/table/DataTable";
import { selectionColumn } from "@/src/components/table/selectionColumn";
import { getActionsColumn } from "@/src/components/table/actionsColumn";
import { useState } from "react";

const CollectionTable = () => {
  const { data: collections, refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    serviceFn: () =>
      collectionService.getCollections({ includeProducts: true }),
  });

  const handleRowClick = (row: Row<CollectionWithProductsImageUrl>) => {
    redirect(`/collections/${row.original.slug}`);
  };

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Construct columns
  let tableColumns: ColumnDef<CollectionWithProductsImageUrl>[] = [];
  tableColumns.push(selectionColumn<CollectionWithProductsImageUrl>());
  tableColumns = tableColumns.concat(collectionColumns);
  tableColumns.push(
    getActionsColumn<CollectionWithProductsImageUrl>({
      entityType: ENTITY_TYPES.COLLECTION,
      deleteItem: collectionService.deleteCollection,
      showDeleteAlert,
      setShowDeleteAlert,
      refetch,
    })
  );

  return (
    <DataTable
      data={collections ?? []}
      columns={tableColumns}
      handleRowClick={handleRowClick}
    ></DataTable>
  );
};

export default CollectionTable;
