"use client";

import { useEffect, useState } from "react";
import { orderService } from "@repo/shared";
import { OrderWithItems } from "@repo/database/types/order";
import CustomerOrderDetail from "@/src/features/orders/components/CustomerOrderDetail";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import { useSession } from "next-auth/react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

interface OrderPageContainerProps {
  orderNumber: string;
}

/**
 * Container component that handles order data fetching, authentication,
 * and error states for the order detail page.
 */
const OrderPageContainer = ({ orderNumber }: OrderPageContainerProps) => {
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const result = await orderService.getOrder(Number(orderNumber));
        if (result.success && result.data) {
          // Verify that this order belongs to the current user
          if (session?.user?.email === result.data.email) {
            setOrder(result.data);
          } else {
            setError("You don't have permission to view this order");
          }
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber && session?.user) {
      fetchOrder();
    } else if (status !== "loading") {
      setIsLoading(false);
      if (!session?.user) {
        setError("Please sign in to view your order");
      }
    }
  }, [orderNumber, session, status]);

  // Loading state
  if (isLoading || status === "loading") {
    return (
      <SectionContainer className="flex items-center justify-center min-h-[400px]">
        <LoadAnimation />
      </SectionContainer>
    );
  }

  // Error states
  if (error) {
    return (
      <SectionContainer className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-2xl font-bold mb-4">{error}</h1>
        <p className="mb-6 text-muted-foreground">
          {error === "Please sign in to view your order"
            ? "You need to be signed in to view your order details"
            : error === "Order not found"
              ? "The order you're looking for doesn't exist"
              : "You don't have permission to view this order"}
        </p>
        <Button asChild>
          <Link
            href={
              error === "Please sign in to view your order"
                ? "/signin"
                : "/dashboard"
            }
          >
            {error === "Please sign in to view your order"
              ? "Sign In"
              : "Back to Dashboard"}
          </Link>
        </Button>
      </SectionContainer>
    );
  }

  // Order not found fallback
  if (!order) {
    return (
      <SectionContainer className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          We couldn't find the order you're looking for
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </SectionContainer>
    );
  }

  // Success state - render order details
  return (
    <SectionContainer>
      <CustomerOrderDetail order={order} />
    </SectionContainer>
  );
};

export default OrderPageContainer;
