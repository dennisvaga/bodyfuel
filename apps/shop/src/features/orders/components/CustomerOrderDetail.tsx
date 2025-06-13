"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { OrderWithItems } from "@repo/database/types/order";
import { Button } from "@repo/ui/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import OrderProgressTracker from "./OrderProgressTracker";
import { FEATURE_FLAGS, formatOrderDateTime } from "@repo/shared";
import { OrderStatusBadge } from "@repo/ui/components/features/orders/OrderStatusBadge";
import { OrderItemsTable } from "@repo/ui/components/features/orders/OrderItemsTable";
import { ShippingInfoCard } from "@repo/ui/components/features/orders/ShippingInfoCard";

interface CustomerOrderDetailProps {
  order: OrderWithItems;
}

/**
 * Customer-facing order detail page
 * Shows order progress, shipping info, order summary, and items
 */
const CustomerOrderDetail = ({ order }: CustomerOrderDetailProps) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Order #{order.orderNumber}</CardTitle>
          <CardDescription>
            {formatOrderDateTime(order.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {/* Order progress visualization */}
          <OrderProgressTracker status={order.status as OrderStatus} />

          {/* Shipping and order items in responsive layout */}
          <div className="flex flex-col md:flex-row gap-6 mt-6">
            {/* Order items table - takes 2/3 space on larger screens */}
            <div className="w-full md:w-2/3">
              <OrderItemsTable order={order} />

              {/* Actions (back to orders, cancel order) */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Orders</Link>
                </Button>
                <Button
                  disabled={
                    isLoading ||
                    order.status === OrderStatus.CANCELLED ||
                    !FEATURE_FLAGS.CANCEL_ORDER
                  }
                  onClick={() => {
                    setIsLoading(true);
                    // Here you would implement order cancellation logic
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                  variant="destructive"
                >
                  {isLoading ? "Processing..." : "Cancel Order"}
                </Button>
              </div>
            </div>

            {/* Shipping info card - takes 1/3 space on larger screens */}
            <div className="w-full md:w-1/3">
              <ShippingInfoCard shippingInfo={order.shippingInfo} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOrderDetail;
