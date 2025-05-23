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

const MiniCart = () => {
  const { cart, total, openMiniCart, setOpenMiniCart } = useCart();
  const router = useRouter();

  return (
    <Drawer
      open={openMiniCart}
      onOpenChange={setOpenMiniCart}
      direction="right"
    >
      <Link
        onClick={(e) => {
          if (!cart?.cartItems || cart?.cartItems?.length === 0) {
            return;
          }
          e.preventDefault();
          setOpenMiniCart(true);
        }}
        className="outline-none"
        href="/cart"
      >
        <ShoppingCart />
      </Link>
      <DrawerContent
        className="w-[300px]"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        <DrawerHeader>
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-scroll scrollbar divide-y">
          <CartItemsList showTotal={false} variant={CartVariants.mini} />
        </div>
        ``
        {/* Buttons */}
        <div className="flex flex-col p-4 gap-4 ">
          <div className="flex flex-row justify-between ">
            <Label>Total</Label>
            <Label className="text-base font-bold">{`${total}$`}</Label>
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
            >
              Checkout
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MiniCart;
