"use client";

import { useEffect, useState } from "react";
import { orderService } from "@repo/shared";
import { OrderWithItems } from "@repo/database/types/order";
import { Session } from "next-auth";

export const useUserOrders = (session: Session | null) => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const result = await orderService.getAllOrders();
        
        if (result.success) {
          // Filter orders for the current user only
          const userOrders = result.data?.filter(
            (order) => order.email === session?.user?.email
          );
          setOrders(userOrders || []);
        } else {
          setError(new Error("Failed to fetch orders"));
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError(error instanceof Error ? error : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  return { orders, isLoading, error };
}; 