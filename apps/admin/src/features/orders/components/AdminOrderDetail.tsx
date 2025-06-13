"use client";

import { OrderWithItems } from "@repo/database/types/order";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { OrderStatusBadge } from "@repo/ui/components/features/orders/OrderStatusBadge";
import { OrderItemsTable } from "@repo/ui/components/features/orders/OrderItemsTable";
import { CustomerInfoCard } from "@repo/ui/components/features/orders/CustomerInfoCard";
import OrderStatusManager from "./OrderStatusManager";
import AdminShippingInfoCard from "./AdminShippingInfoCard";

interface AdminOrderDetailProps {
  order: OrderWithItems;
  status: OrderStatus;
  onStatusChange: (status: OrderStatus) => Promise<void>;
}

/**
 * Main order detail page component for admins
 * Combines customer info, shipping details, order items, and status management
 */
const AdminOrderDetail = ({
  order,
  status,
  onStatusChange,
}: AdminOrderDetailProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="flex items-center text-sm hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to orders
        </Link>
        <OrderStatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Order info card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">
                    Order #{order.orderNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Order status management */}
                <OrderStatusManager
                  currentStatus={status}
                  onStatusChange={onStatusChange}
                />

                {/* Order items table */}
                <OrderItemsTable order={order} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer & Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <CustomerInfoCard email={order.email} userId={order.userId} />

          {/* Shipping Info */}
          <AdminShippingInfoCard
            shippingInfo={order.shippingInfo}
            shippingMethod={order.shippingMethod}
            estimatedDelivery={order.estimatedDelivery}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
