"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Drawer,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import Product from "@repo/ui/components/features/products/Product";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/cartContext";
import CartItemsList from "./CartItemsList";
import { CartVariants } from "../types/cartEnums";

const MiniCartDrawer = () => {
  const { cart, total, openMiniCart, setOpenMiniCart, isChangingQuantity } =
    useCart();
  const router = useRouter();

  // Check if cart is empty to conditionally render content
  const isEmpty = !cart?.cartItems || cart.cartItems.length === 0;

  return (
    <Drawer
      open={openMiniCart}
      onOpenChange={setOpenMiniCart}
      direction="right"
      handleOnly
    >
      {/* Cart trigger button that acts as drawer handle */}
      <Link
        onClick={(e) => {
          // Navigate to cart page if empty, otherwise open mini cart drawer
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
          // Display item count badge when cart has items
          <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {cart.cartItems.length}
          </span>
        )}
      </Link>
      {/* Drawer content */}
      <DrawerContent
        className="w-full max-w-[300px] flex flex-col max-h-[100dvh]"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
      >
        {/* Fixed header */}
        <div className="flex-shrink-0 flex justify-between items-center mb-6">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-bold">Your Cart</DrawerTitle>
          </DrawerHeader>
          <DrawerClose className="text-dark hover:cursor-pointer rounded-full">
            <div className="p-2">
              <X className="w-5 h-5" />
            </div>
          </DrawerClose>
        </div>

        {/* Conditional rendering based on cart state */}
        {isEmpty ? (
          // Empty cart view
          <div className="flex flex-col items-center justify-center p-6">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        ) : (
          <>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scrollbar divide-y px-4 min-h-0">
              <CartItemsList showTotal={false} variant={CartVariants.mini} />
            </div>

            {/* Fixed footer with safe area padding */}
            <div className="flex-shrink-0 flex flex-col p-4 gap-4 pb-6 sm:pb-4">
              <Product.Total
                priceColor="dark:text-gray-150 text-base"
                amount={total}
                isLoading={isChangingQuantity}
              />
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    setOpenMiniCart(false);
                    router.push("/cart");
                  }}
                  variant="outline"
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
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default MiniCartDrawer;
