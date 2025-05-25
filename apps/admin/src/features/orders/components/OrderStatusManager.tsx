"use client";

import { useState } from "react";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

interface OrderStatusManagerProps {
  currentStatus: OrderStatus;
  onStatusChange: (status: OrderStatus) => Promise<void>;
}

/**
 * Admin component for changing order status
 * Provides dropdown with all possible status options
 */
const OrderStatusManager = ({
  currentStatus,
  onStatusChange,
}: OrderStatusManagerProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await onStatusChange(newStatus as OrderStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3 text-3xl">Order Status</h3>
      <div className="flex items-center space-x-4">
        <Select
          disabled={isUpdating}
          value={currentStatus}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={OrderStatus.PAID}>Paid</SelectItem>
            <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
            <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
          </SelectContent>
        </Select>
        {isUpdating && (
          <div className="text-sm text-muted-foreground">Updating...</div>
        )}
      </div>
    </div>
  );
};

export default OrderStatusManager;
