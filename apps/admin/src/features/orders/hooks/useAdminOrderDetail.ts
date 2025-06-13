"use client";

import { useState, useEffect } from "react";
import { OrderWithItems } from "@repo/database/types/order";
import { adminOrderService } from "../services/orderService";
import { OrderStatus } from "@repo/database/types/prismaTypes";
import { useRouter } from "next/navigation";
import { toast } from "@repo/ui/hooks/use-toast";
import { orderService } from "@repo/shared";

interface UseAdminOrderDetailProps {
  orderNumber: string;
}

export const useAdminOrderDetail = ({
  orderNumber,
}: UseAdminOrderDetailProps) => {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const result = await orderService.getOrder(Number(orderNumber));
        if (result.success && result.data) {
          setOrder(result.data);
          setStatus(result.data.status as OrderStatus);
        } else {
          toast({
            title: "Error",
            description: "Order not found",
            variant: "destructive",
          });
          router.push("/orders");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber, router]);

  const updateOrderStatus = async (newStatus: OrderStatus) => {
    if (!order) return;

    try {
      const result = await adminOrderService.updateOrderStatus(
        order.id,
        newStatus
      );
      if (result.success) {
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        });

        // Update the local state
        setStatus(newStatus);
        setOrder((prevOrder) =>
          prevOrder ? { ...prevOrder, status: newStatus } : null
        );

        return;
      }
      throw new Error("Failed to update status");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    order,
    status,
    isLoading,
    updateOrderStatus,
  };
};
