import CartItemsList from "@/src/features/cart/components/CartItemsList";
import { CartVariants } from "@/src/features/cart/types/cartEnums";
import React from "react";

const Page = () => {
  return (
    <section className="layout">
      <div className="flex flex-col gap-8 md:max-w-[80%] mx-auto">
        <h1 className="text-4xl"> Your Cart</h1>

        <p>Your cart is currently empty.</p>

        <CartItemsList
          variant={CartVariants.cart}
          showSubtotalLabel={true}
          showCheckoutButton={true}
        />
      </div>
    </section>
  );
};

export default Page;
