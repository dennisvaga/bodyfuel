"use client";

import * as React from "react";
import { OrderStatus } from "@repo/database/types/prismaTypes";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

/**
 * Component to display an order status with appropriate color coding
 */
export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const getStatusClasses = () => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.PAID:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.SHIPPED:
        return "bg-green-100 text-green-800";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${getStatusClasses()} ${className}`}
    >
      {status}
    </span>
  );
};
