import { OrderWithItems } from "@repo/database/types/order";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

/**
 * Column definitions for the admin orders table
 * Includes order number, date, customer info, status, total, and actions
 */
export const orderColumns: ColumnDef<OrderWithItems>[] = [
  {
    accessorFn: (row) => `#${row.orderNumber}`,
    id: "orderNumber",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/orders/${row.original.orderNumber}`}
          className="hover:underline"
        >
          #{row.original.orderNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
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
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : status === "SHIPPED"
                ? "bg-green-100 text-green-800"
                : status === "CANCELLED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
          }`}
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
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.total);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/orders/${row.original.orderNumber}`} />
        </Button>
      );
    },
  },
];
