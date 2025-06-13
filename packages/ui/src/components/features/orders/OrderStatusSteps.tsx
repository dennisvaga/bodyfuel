"use client";

import * as React from "react";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { Package, Truck, CheckCircle } from "lucide-react";

interface OrderStatusStepsProps {
  status: OrderStatus;
}

/**
 * A component that displays the order status in a step-based visual representation
 */
export const OrderStatusSteps: React.FC<OrderStatusStepsProps> = ({
  status,
}) => {
  // Convert order status to step number for progress display
  const getStatusStepNumber = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 1;
      case OrderStatus.PAID:
        return 2;
      case OrderStatus.SHIPPED:
        return 3;
      case OrderStatus.CANCELLED:
        return -1;
      default:
        return 0;
    }
  };

  const statusStep = getStatusStepNumber(status);

  if (status === OrderStatus.CANCELLED) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
        This order was cancelled.
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h3 className="font-medium mb-4">Order Progress</h3>
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              <Package className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Processing</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              <Truck className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Shipped</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStep >= 3 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-xs mt-1">Delivered</span>
          </div>
        </div>
        <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width:
                statusStep === 1
                  ? "0%"
                  : statusStep === 2
                    ? "50%"
                    : statusStep === 3
                      ? "100%"
                      : "0%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusSteps;
