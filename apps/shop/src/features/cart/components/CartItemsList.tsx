"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import Product from "../../products/components/Product";
import { CartItemWithProduct, CartWithItems } from "@repo/database/types/cart";
import CartItemSkeleton, { TotalSkeleton } from "./CartItemSkeleton";
import { CartVariants } from "../types/cartEnums";
import { useCart } from "../contexts/cartContext";
import { X } from "lucide-react";

interface CartItemsListProps {
  variant?: CartVariants;
  showTotal?: boolean;
  showSubtotalLabel?: boolean;
  showCheckoutButton?: boolean;
}

/**
 * Reusable CartItemsList component that works across cart, checkout, and mini cart
 * Maintains the original structure and behavior of each cart variant
 */
const CartItemsList = ({
  variant = CartVariants.cart,
  showTotal = true,
  showSubtotalLabel = true,
  showCheckoutButton = false,
}: CartItemsListProps) => {
  const router = useRouter();
  const {
    cart,
    isLoading,
    total,
    setOpenMiniCart,
    changeQuantity,
    removeFromCart,
  } = useCart();

  // Empty cart - only for cart variant
  const renderEmptyCart = () => {
    if (
      variant === CartVariants.cart &&
      !isLoading &&
      (!cart?.cartItems || !cart?.cartItems.length)
    ) {
      return (
        <div>
          <Button onClick={() => router.push("/")}>Continue shopping</Button>
        </div>
      );
    }
    return null;
  };

  const emptyCart = renderEmptyCart();
  if (emptyCart) return emptyCart;

  // Skeletons - specific to each variant
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <CartItemSkeleton
          variant={variant}
          count={3}
          withBrigterBg={variant === CartVariants.checkout}
        />
        {showTotal && (
          <TotalSkeleton withBrigterBg={variant === CartVariants.checkout} />
        )}
        {variant === CartVariants.cart && showCheckoutButton && (
          <Button>Checkout</Button>
        )}
      </div>
    );
  }

  const handleProductClick = (item: CartItemWithProduct) => {
    setOpenMiniCart(false);
    router.push(`/products/${item.product.slug}`);
  };

  // Different rendering based on variant, matching original structure exactly
  const renderCartItems = () => {
    if (!cart?.cartItems?.length) return null;

    switch (variant) {
      case CartVariants.mini:
        return cart.cartItems.map((item: CartItemWithProduct) => (
          <Product className="px-4 py-6" key={item.productId}>
            {/* Remove button */}
            <button
              onClick={() => removeFromCart(item.productId)}
              className="flex flex-col w-5 h-5 p-1 text-muted-foreground hover:text-destructive rounded-full hover:bg-muted transition-colors"
              aria-label="Remove item"
            >
              <X />
            </button>
            {/* Product image */}
            <Product.Image
              src={item.product.images?.[0]?.imageUrl || "/"}
              width={90}
              onClick={() => handleProductClick(item)}
            />
            <div className="flex flex-col gap-4 text-end">
              <div className="flex justify-between items-start">
                {/* Product name */}
                <Product.Name
                  name={item.product.name}
                  onClick={() => handleProductClick(item)}
                />
              </div>
              {/* Product price */}
              <Product.Price price={item.product.price} />
              <div className="flex flex-row justify-end">
                {changeQuantity && (
                  <Product.QuantityControls
                    quantity={item.quantity}
                    onChangeQuantity={(newQty: number) => {
                      changeQuantity(item.productId, newQty);
                    }}
                    className="items-end"
                  />
                )}
              </div>
            </div>
          </Product>
        ));

      case CartVariants.checkout:
        return cart?.cartItems?.map((item: CartItemWithProduct) => (
          <Product key={item.productId} className="gap-4">
            <Product.Image
              width={80}
              className="border p-2"
              src={item.product.images?.[0]?.imageUrl || "/"}
            />
            <div className="flex flex-col justfity-start w-full">
              <Product.Name name={item.product.name} />
              <Product.Price price={item.product.price} />
            </div>
          </Product>
        ));

      case CartVariants.mini:
        return cart.cartItems.map((item: CartItemWithProduct) => (
          <Product className="px-4 py-6" key={item.productId}>
            <Product.Image
              src={item.product.images?.[0]?.imageUrl || "/"}
              width={90}
              onClick={() => handleProductClick(item)}
            />
            <div className="flex flex-col gap-4 text-end">
              <Product.Name
                name={item.product.name}
                onClick={() => handleProductClick(item)}
              />
              <Product.Price price={item.product.price} />
              <div className="flex flex-row justify-end">
                {changeQuantity && (
                  <Product.QuantityControls
                    quantity={item.quantity}
                    onChangeQuantity={(newQty: number) => {
                      changeQuantity(item.productId, newQty);
                    }}
                    className="items-end"
                  />
                )}
              </div>
            </div>
          </Product>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">{renderCartItems()}</div>

      {/* Subtotal/Total based on variant */}
      {showTotal && (
        <div
          className={`flex justify-between ${variant === "cart" ? "pt-10" : "pt-2"}`}
        >
          <Label className="text-lg ">
            {showSubtotalLabel ? "Subtotal:" : "Total:"}
          </Label>
          <Label className="text-lg font-bold"> ${total}</Label>
        </div>
      )}

      {/* Checkout button if needed */}
      {variant === "cart" && showCheckoutButton && (
        <Button onClick={() => router.push("/checkout")}>Checkout</Button>
      )}
    </div>
  );
};

export default CartItemsList;
