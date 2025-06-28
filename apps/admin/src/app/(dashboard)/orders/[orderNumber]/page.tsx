"use client";

import { useParams } from "next/navigation";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import AdminOrderDetail from "@/src/features/orders/components/AdminOrderDetail";
import { useAdminOrderDetail } from "@/src/features/orders/hooks/useAdminOrderDetail";

const OrderPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { order, status, isLoading, updateOrderStatus } = useAdminOrderDetail({
    orderNumber: orderNumber as string,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadAnimation />
      </div>
    );
  }

  if (!order || !status) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          We couldn't find the order you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <AdminOrderDetail
        order={order}
        status={status}
        onStatusChange={updateOrderStatus}
      />
    </div>
  );
};

export default OrderPage;
