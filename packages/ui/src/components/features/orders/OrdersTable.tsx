"use client";

import * as React from "react";
import { OrderWithItems } from "@repo/database/types/order";
import { Button } from "@repo/ui/components/ui/button";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { formatOrderCurrency, formatOrderDate } from "../utils/formatters.js";
import { getOrderStatusClass } from "../utils/orderColumnUtils.js";
import { ColumnDef, Row } from "@tanstack/react-table";

interface OrdersTableProps {
  orders: OrderWithItems[];
  variant: "admin" | "customer";
  detailsBaseUrl: string;
  onRowClick?: (order: OrderWithItems) => void;
}

/**
 * Shared orders table component that can be configured for both admin and customer views
 */
export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  variant,
  detailsBaseUrl,
  onRowClick,
}) => {
  const columns = React.useMemo<ColumnDef<OrderWithItems>[]>(() => {
    const baseColumns: ColumnDef<OrderWithItems>[] = [
      {
        accessorFn: (row) => `#${row.orderNumber}`,
        id: "orderNumber",
        header: "Order",
        cell: ({ row }) => {
          return (
            <link
              href={`${detailsBaseUrl}/${row.original.orderNumber}`}
              className="hover:underline"
            >
              #{row.original.orderNumber}
            </link>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          return formatOrderDate(row.original.createdAt);
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status as OrderStatus;
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs ${getOrderStatusClass(status)}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
          return formatOrderCurrency(row.original.total);
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <Button variant="ghost" size="sm" asChild>
              <link href={`${detailsBaseUrl}/${row.original.orderNumber}`}>
                View
              </link>
            </Button>
          );
        },
      },
    ];

    // Add admin-specific columns
    if (variant === "admin") {
      return [
        ...baseColumns.slice(0, 2),
        {
          accessorFn: (row) =>
            `${row.shippingInfo?.firstName} ${row.shippingInfo?.lastName}`,
          header: "Customer",
          cell: ({ row }) => {
            const name = row.original.shippingInfo
              ? `${row.original.shippingInfo.firstName} ${row.original.shippingInfo.lastName}`
              : "";
            return (
              <div>
                <div>{name}</div>
                <div className="text-xs text-muted-foreground">
                  {row.original.email}
                </div>
              </div>
            );
          },
        },
        ...baseColumns.slice(2),
      ];
    }

    return baseColumns;
  }, [variant, detailsBaseUrl]);

  // For admin view, use a more advanced table
  if (variant === "admin") {
    return (
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              {variant === "admin" && (
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Customer
                </th>
              )}
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onRowClick && onRowClick(order)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <link
                    href={`${detailsBaseUrl}/${order.orderNumber}`}
                    className="hover:underline"
                  >
                    #{order.orderNumber}
                  </link>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatOrderDate(order.createdAt)}
                </td>
                {variant === "admin" && (
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div>
                        {order.shippingInfo
                          ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                          : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.email}
                      </div>
                    </div>
                  </td>
                )}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getOrderStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {formatOrderCurrency(order.total)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <link href={`${detailsBaseUrl}/${order.orderNumber}`}>
                      View
                    </link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // For customer view, use a simpler list format
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4"
            onClick={() => onRowClick && onRowClick(order)}
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-medium">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getOrderStatusClass(order.status)}`}
              >
                {order.status}
              </span>
            </div>
            <p>
              <span className="font-medium">Total:</span>{" "}
              {formatOrderCurrency(order.total)}
            </p>
            <p>
              <span className="font-medium">Items:</span>{" "}
              {order.orderItems.length}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <link href={`${detailsBaseUrl}/${order.orderNumber}`}>
                View Details
              </link>
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersTable;
