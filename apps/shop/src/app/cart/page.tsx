"use client";

import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";
import { useCart } from "@/src/features/cart/contexts/cartContext";
import CartItemSkeleton, {
  TotalSkeleton,
} from "@/src/features/cart/components/CartItemSkeleton";
import { Button } from "@repo/ui/components/ui/button";
import PageLayout from "@/src/layouts/PageLayout";
import React from "react";

const Page = () => {
  const { cart, isLoading } = useCart();

  return (
    <PageLayout
      data={cart}
      isLoading={isLoading}
      requiresEntity={false}
      containerClassName="flex items-center justify-center min-h-[calc(50vh)]"
    >
      {(cartData, loading) => (
        <div className="flex flex-col gap-8 items-center w-full md:max-w-[70%]">
          <h1 className="text-4xl">Your Cart</h1>

          {loading ? (
            <div className="flex flex-col gap-4 w-full">
              <CartItemSkeleton variant={CartVariants.cart} count={3} />
              <div className="pt-10">
                <TotalSkeleton />
              </div>
              <Button>Checkout</Button>
            </div>
          ) : (
            <CartItemsList
              variant={CartVariants.cart}
              showSubtotalLabel={true}
              showCheckoutButton={true}
            />
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default Page;
