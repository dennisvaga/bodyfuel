"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { OrderWithItems } from "@repo/database/types/order";
import Link from "next/link";
import { formatCurrency } from "@repo/shared";

interface OrdersListProps {
  orders: OrderWithItems[];
}

const OrdersList = ({ orders }: OrdersListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>View and track your orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === OrderStatus.PENDING
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === OrderStatus.SHIPPED
                          ? "bg-green-100 text-green-800"
                          : order.status === OrderStatus.CANCELLED
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p>
                  <span className="font-medium">Total:</span>{" "}
                  {formatCurrency(order.total)}
                </p>
                <p>
                  <span className="font-medium">Items:</span>{" "}
                  {order.orderItems.length}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={`/orders/${order.orderNumber}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrdersList;
