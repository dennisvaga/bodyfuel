"use client";

import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { orderService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import type { OrderWithItems } from "@repo/database/types/order";
import { useTableConfig } from "@/src/hooks/useTableConfig";
import { orderColumns } from "@/src/features/orders/components/table/orderColumns";

/**
 * Order-specific table configuration hook
 * Handles data fetching, column setup, and actions
 */
export function useOrderTable() {
  const router = useRouter();

  // Fetch orders data
  const { data: orders, refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.ORDERS,
    serviceFn: orderService.getAllOrders,
  });

  // Row click handler
  const handleRowClick = (row: Row<OrderWithItems>) => {
    router.push(`/orders/${row.original.orderNumber}`);
  };

  // Configure table with all settings
  const tableConfig = useTableConfig({
    columns: orderColumns,
    data: orders ?? [],
    enableSelection: false, // Orders typically don't need bulk selection
    enableBulkActions: false,
    onRowClick: handleRowClick,
    isLoading: false,
  });

  return {
    tableConfig,
  };
}
