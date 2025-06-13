"use client";

import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";
import { useCart } from "@/src/features/cart/contexts/cartContext";
import React from "react";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
import PageLayout from "@/src/layouts/PageLayout";

const Page = () => {
  const { cart, isLoading } = useCart();

  return (
    <PageLayout
      isLoading={isLoading}
      data={cart}
      containerClassName="flex items-center justify-center min-h-[calc(50vh)]"
    >
      {(cartData) => {
        const isCartEmpty =
          !cartData?.cartItems || cartData.cartItems.length === 0;

        return (
          <SectionContainer className="flex items-center justify-center min-h-[calc(50vh)]">
            <div className="flex flex-col gap-8 items-center w-full md:max-w-[70%]">
              <h1 className="text-4xl">Your Cart</h1>

              {isCartEmpty && <p>Your cart is currently empty.</p>}

              <CartItemsList
                variant={CartVariants.cart}
                showSubtotalLabel={true}
                showCheckoutButton={true}
              />
            </div>
          </SectionContainer>
        );
      }}
    </PageLayout>
  );
};

export default Page;
