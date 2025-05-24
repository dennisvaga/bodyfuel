"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Drawer,
} from "@repo/ui/components/ui/drawer";
import { Label } from "@repo/ui/components/ui/label";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/cartContext";
import CartItemsList from "./CartItemsList";
import { CartVariants } from "../types/cartEnums";

const MiniCartDrawer = () => {
  const { cart, total, openMiniCart, setOpenMiniCart } = useCart();
  const router = useRouter();

  const isEmpty = !cart?.cartItems || cart.cartItems.length === 0;

  return (
    <Drawer
      open={openMiniCart}
      onOpenChange={setOpenMiniCart}
      direction="right"
    >
      <Link
        onClick={(e) => {
          if (isEmpty) {
            return;
          }
          e.preventDefault();
          setOpenMiniCart(true);
        }}
        className="outline-none relative"
        href="/cart"
      >
        <ShoppingCart />
        {!isEmpty && (
          // Cart item count badge
          <span className="absolute -top-0 -right-0 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {cart.cartItems.length}
          </span>
        )}
      </Link>
      {/* Drawer content */}
      <DrawerContent
        className="md:w-[330px] w-full"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <DrawerHeader>
          <DrawerTitle>Your Cart</DrawerTitle>
        </DrawerHeader>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center p-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col h-full justify-between">
            <div className="overflow-y-auto scrollbar divide-y px-4">
              {/* Cart items */}
              <CartItemsList showTotal={false} variant={CartVariants.mini} />
            </div>
            {/* Buttons */}
            <div className="flex flex-col p-4 gap-4 border-t">
              <div className="flex flex-row justify-between">
                <Label className="text-base">Total</Label>
                <Label className="text-base font-bold">
                  ${total.toFixed(2)}
                </Label>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setOpenMiniCart(false);
                    router.push("/cart");
                  }}
                >
                  View Cart
                </Button>
                <Button
                  onClick={() => {
                    setOpenMiniCart(false);
                    router.push("/checkout");
                  }}
                  variant="secondary"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MiniCartDrawer;
