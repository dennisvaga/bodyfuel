"use client";

import { OrderWithItems } from "@repo/database/types/order";
import { Package } from "lucide-react";
import { formatCurrency } from "@repo/shared";

interface OrderItemsTableProps {
  order: OrderWithItems;
}

/**
 * Table component to display order items
 */
export const OrderItemsTable = ({ order }: OrderItemsTableProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-medium mb-3 text-3xl">Order Items</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y divide-border">
            {order.orderItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                      {item.product?.images &&
                      item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0].imageUrl}
                          alt={item.product.name}
                          className="object-cover h-full w-full rounded-md"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="text-sm font-medium">
                      {item.product?.name}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                  {item.quantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary - Moved outside the table */}
      <div className="mt-6 ml-auto w-full md:w-1/2 lg:w-1/3 px-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-sm font-medium">
              {formatCurrency(order.total - (order.shippingCost || 0))}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm text-muted-foreground">Shipping</span>
            <span className="text-sm font-medium">
              {formatCurrency(order.shippingCost || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-semibold">Total</span>
            <span className="text-base font-bold">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
