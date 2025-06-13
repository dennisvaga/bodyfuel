"use client";

import { Package } from "lucide-react";
import { formatCurrency } from "@repo/shared";
import { OrderWithItems } from "@repo/database/types/order";
import Product from "../../features/products/Product";

interface OrderItemsTableProps {
  order: OrderWithItems;
}

/**
 * Table component to display order items
 */
export const OrderItemsTable = ({ order }: OrderItemsTableProps) => {
  return (
    <div className="space-y-6">
      <h3 className="font-medium mb-3 text-2xl lg:text-3xl">Order Items</h3>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden space-y-4">
        {order.orderItems.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-background">
            <div className="flex items-start space-x-3 mb-3">
              <div className="h-12 w-12 bg-transparent rounded-md flex items-center justify-center flex-shrink-0">
                {item.product?.images && item.product.images.length > 0 ? (
                  <Product.Image
                    src={item.product.images[0].imageUrl}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                ) : (
                  <Package className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Product.Name
                  name={item.product?.name || "Unknown Product"}
                  className="text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-medium">{item.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">
                  {formatCurrency(item.price)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-muted-foreground font-medium">
                  Total:
                </span>
                <span className="font-bold">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block border rounded-lg overflow-hidden">
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
                    <div className="h-10 w-10 bg-transparent rounded-md flex items-center justify-center mr-3">
                      {item.product?.images &&
                      item.product.images.length > 0 ? (
                        <Product.Image
                          src={item.product.images[0].imageUrl}
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <Product.Name
                      name={item.product?.name || "Unknown Product"}
                      className="text-sm font-medium"
                    />
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

      {/* Order Summary - Responsive */}
      <div className="mt-6 w-full lg:ml-auto lg:w-1/2 xl:w-1/3 px-2">
        <div className="space-y-2 border rounded-lg p-4 lg:border-0 lg:p-0">
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
