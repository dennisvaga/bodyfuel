"use client";

import React, { useState } from "react";
import { ENTITY_TYPES, productService, QUERY_KEYS } from "@repo/shared";
import { redirect } from "next/navigation";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useFetchQuery } from "@repo/shared";
import { DataTable } from "@/src/components/table/DataTable";
import Pagination from "@repo/ui/components/Pagination";
import { productColumns } from "./productColumns";
import { getActionsColumn } from "@/src/components/table/actionsColumn";
import { selectionColumn } from "@/src/components/table/selectionColumn";

const ProductTable = () => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    itemsPerPage: 15,
  });

  const {
    data: products,
    isLoading,
    pagination,
    refetch,
  } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS_PAGINATED(paginationParams),
    serviceFn: () =>
      productService.getProducts({ pagination: paginationParams }),
  });

  const handleRowClick = (row: Row<ProductWithImageUrl>) => {
    // Redirect to edit product
    redirect(`/products/${row.original.slug}`);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (pageSize: number) => {
    setPaginationParams({
      currentPage: 1, // Reset to first page when changing page size
      itemsPerPage: pageSize,
    });
  };

  // Construct columns with selection
  let tableColumns: ColumnDef<ProductWithImageUrl>[] = [];
  tableColumns.push(selectionColumn<ProductWithImageUrl>());
  tableColumns = tableColumns.concat(productColumns);
  tableColumns.push(
    getActionsColumn<ProductWithImageUrl>({
      entityType: ENTITY_TYPES.PRODUCT,
      deleteItem: productService.deleteProduct,
      showDeleteAlert,
      setShowDeleteAlert,
      refetch,
    })
  );

  return (
    <div className="space-y-4">
      <DataTable
        data={products ?? []}
        columns={tableColumns}
        handleRowClick={handleRowClick}
      />

      <Pagination
        pagination={
          pagination ?? {
            currentPage: paginationParams.currentPage,
            totalPages: 1,
            totalItems: 0,
            itemsPerPage: paginationParams.itemsPerPage,
          }
        }
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductTable;
