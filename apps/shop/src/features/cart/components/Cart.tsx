"use client";
import React from "react";
import CartItemsList from "./CartItemsList";
import { CartVariants } from "../types/cartEnums";

/**
 * Cart component for the cart page.
 * @returns
 */
const Cart = () => {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-4xl"> Your Cart</h1>

      <p>Your cart is currently empty.</p>

      <CartItemsList
        variant={CartVariants.cart}
        showSubtotalLabel={true}
        showCheckoutButton={true}
      />
    </div>
  );
};

export default Cart;
