"use client";

import { adminOrderService } from "@/src/features/orders/services/orderService";
import { QUERY_KEYS } from "@repo/shared";
import type { OrderWithItems } from "@repo/database/types/order";
import { Row } from "@tanstack/react-table";
import { orderColumns } from "./orderColumns";
import { useFetchQuery } from "@repo/shared";
import { DataTable } from "@/src/components/table/DataTable";
import { useRouter } from "next/navigation";

/**
 * Orders table component for displaying all orders in admin dashboard
 * Uses DataTable for pagination, sorting, and filtering
 */
const OrderTable = () => {
  const router = useRouter();
  const { data: orders, refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.ORDERS,
    serviceFn: adminOrderService.getAllOrders,
  });

  const handleRowClick = (row: Row<OrderWithItems>) => {
    router.push(`/orders/${row.original.orderNumber}`);
  };

  return (
    <DataTable
      data={orders ?? []}
      columns={orderColumns}
      handleRowClick={handleRowClick}
    />
  );
};

export default OrderTable;
