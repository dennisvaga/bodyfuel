"use client";

import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";
import { useCart } from "@/src/features/cart/contexts/cartContext";
import React from "react";

const Page = () => {
  const { cart, isLoading } = useCart();

  const isCartEmpty = !cart?.cartItems || cart.cartItems.length === 0;

  return (
    <section className="layout flex items-center justify-center min-h-[calc(50vh)]">
      <div className="flex flex-col gap-8 md:max-w-[80%] mx-auto items-center">
        <h1 className="text-4xl">Your Cart</h1>

        {isCartEmpty && <p>Your cart is currently empty.</p>}

        {!isLoading && (
          <CartItemsList
            variant={CartVariants.cart}
            showSubtotalLabel={true}
            showCheckoutButton={true}
          />
        )}
      </div>
    </section>
  );
};

export default Page;
