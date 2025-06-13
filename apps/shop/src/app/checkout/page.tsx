"use client";

import CheckoutForm from "@/src/features/checkout/components/CheckoutForm";
import CheckoutPageLayout from "@/src/features/checkout/components/CheckoutPageLayout";
import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";
import React from "react";

const Page = () => {
  return (
    <CheckoutPageLayout
      mainContent={<CheckoutForm />}
      sidebarContent={
        <CartItemsList
          variant={CartVariants.checkout}
          showSubtotalLabel={false}
        />
      }
    />
  );
};

export default Page;
