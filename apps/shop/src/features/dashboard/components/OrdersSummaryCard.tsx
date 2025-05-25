"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { OrderWithItems } from "@repo/database/types/order";

interface OrdersSummaryCardProps {
  orders: OrderWithItems[];
}

const OrdersSummaryCard = ({ orders }: OrdersSummaryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Total Orders:</span> {orders.length}
          </p>
          <p>
            <span className="font-medium">Pending:</span>{" "}
            {
              orders.filter((order) => order.status === OrderStatus.PENDING)
                .length
            }
          </p>
          <p>
            <span className="font-medium">Shipped:</span>{" "}
            {
              orders.filter((order) => order.status === OrderStatus.SHIPPED)
                .length
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersSummaryCard;
