"use client";
import React from "react";
import { useCart } from "../contexts/cartContext";
import CartItemsList from "./CartItemsList";
import { CartVariants } from "../types/cartEnums";

const CheckoutCart: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <CartItemsList variant={CartVariants.checkout} showSubtotalLabel={false} />
    </div>
  );
};

export default CheckoutCart;
