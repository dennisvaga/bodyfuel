"use client";

import { useState } from "react";
import TableLayout from "@/src/components/table/TableLayout";
import { DataTable } from "@/src/components/table/DataTable";
import Pagination from "@repo/ui/components/Pagination";
import { useProductTable } from "@/src/features/products/hooks/useProductTable";

const Dashboard = () => {
  const [paginationParams, setPaginationParams] = useState({
    currentPage: 1,
    itemsPerPage: 15,
  });

  const { tableConfig, pagination, isLoading } = useProductTable({
    paginationParams,
  });

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

  return (
    <TableLayout heading="products" primaryAction={tableConfig.primaryAction}>
      <div className="space-y-4">
        <DataTable config={tableConfig} />
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
    </TableLayout>
  );
};

export default Dashboard;
