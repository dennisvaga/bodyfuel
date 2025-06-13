"use client";

import { useParams } from "next/navigation";
import OrderPageContainer from "@/src/features/orders/components/OrderPageContainer";

const OrderPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  if (!orderNumber) {
    return <div>Invalid order number</div>;
  }

  return <OrderPageContainer orderNumber={orderNumber} />;
};

export default OrderPage;
