import { OrderStatus } from "@repo/database/types/prismaTypes";
import { OrderWithItems } from "@repo/database/types/order";
import { formatOrderCurrency, formatOrderDate } from "./formatters.js";

/**
 * Format an order number with a hash prefix
 */
export const formatOrderNumber = (orderNumber: number): string => {
  return `#${orderNumber}`;
};

/**
 * Get status class for styling based on order status
 */
export const getOrderStatusClass = (status: OrderStatus): string => {
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

/**
 * Get customer name from order shipping info
 */
export const getCustomerNameFromOrder = (order: OrderWithItems): string => {
  return order.shippingInfo
    ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
    : "";
};

/**
 * Format order total as currency
 */
export const formatOrderTotal = (order: OrderWithItems): string => {
  return formatOrderCurrency(order.total);
};
