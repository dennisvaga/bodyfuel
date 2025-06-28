"use client";
import React from "react";
import { Label } from "@repo/ui/components/ui/label";
import { Button } from "@repo/ui/components/ui/button";
import { useRouter } from "next/navigation";
import Product from "@repo/ui/components/features/products/Product";
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
    isChangingQuantity,
    isRemovingFromCart,
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

  // For cart variant, loading is handled at page level
  // For other variants (mini, checkout), handle loading here
  if (isLoading && variant !== CartVariants.cart) {
    return (
      <div className="flex flex-col gap-4">
        <CartItemSkeleton variant={variant} count={3} />
        {showTotal && <TotalSkeleton />}
      </div>
    );
  }

  const handleProductClick = (item: CartItemWithProduct) => {
    setOpenMiniCart(false);
    router.push(`/products/${item.product.slug}`);
  };

  const renderCartItems = () => {
    if (!cart?.cartItems?.length) return null;

    switch (variant) {
      case CartVariants.mini:
        return cart.cartItems.map((item: CartItemWithProduct) => (
          <div key={`${item.productId}-${item.variantId || "no-variant"}`}>
            <Product className="px-4 py-6">
              <div className="relative flex flex-row gap-2">
                {/* Remove button */}
                <button
                  onClick={() =>
                    !isRemovingFromCart &&
                    removeFromCart(item.productId, item.variantId)
                  }
                  disabled={isRemovingFromCart}
                  className="absolute left-0 top-0 z-10 flex flex-col w-4 h-4 text-muted-foreground hover:text-destructive rounded-full transition-colors hover:cursor-pointer disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <X />
                </button>

                {/* Product image */}
                <Product.Image
                  src={item.product.images?.[0]?.imageUrl || "/"}
                  width={100}
                  onClick={() => handleProductClick(item)}
                  className="items-end"
                />
              </div>

              <div className="flex flex-col gap-4 text-end">
                <div className="flex justify-between items-start">
                  {/* Product name */}
                  <Product.Name
                    name={item.product.name}
                    onClick={() => handleProductClick(item)}
                  />
                </div>
                {/* Variant options */}
                <Product.VariantOptions variant={item.variant} />
                {/* Product price - use cart item price (variant price) or fallback to product price */}
                <Product.Price price={item.price || item.product.price} />
                <div className="flex flex-row justify-end">
                  {changeQuantity && (
                    <Product.QuantityControls
                      quantity={item.quantity}
                      onChangeQuantity={(newQty: number) => {
                        changeQuantity(item.productId, newQty, item.variantId);
                      }}
                      className="items-end"
                      isLoading={isChangingQuantity}
                    />
                  )}
                </div>
              </div>
            </Product>
            <div className="border-b border mt-8"></div>
          </div>
        ));

      case CartVariants.checkout:
        return cart?.cartItems?.map((item: CartItemWithProduct) => (
          <Product
            key={`${item.productId}-${item.variantId || "no-variant"}`}
            className="gap-4"
          >
            <Product.Image
              width={80}
              className="border p-2"
              src={item.product.images?.[0]?.imageUrl || "/"}
            />
            <div className="flex flex-col justfity-start w-full">
              <Product.Name name={item.product.name} />
              <Product.VariantOptions variant={item.variant} />
              <Product.Price price={item.price || item.product.price} />
            </div>
          </Product>
        ));

      case CartVariants.cart:
        return cart.cartItems.map((item: CartItemWithProduct) => {
          const productTotal =
            item.quantity * (item.price || item.product.price || 0);

          return (
            <Product
              key={`${item.productId}-${item.variantId || "no-variant"}`}
              className="flex sm:flex-row flex-col gap-4 items-center border p-8 rounded-xl"
            >
              <div className="flex flex-row">
                <div className="flex flex-row gap-2">
                  {/* Remove button */}
                  <button
                    onClick={() =>
                      !isRemovingFromCart &&
                      removeFromCart(item.productId, item.variantId)
                    }
                    disabled={isRemovingFromCart}
                    className="flex flex-col w-4 h-4 text-muted-foreground hover:text-destructive rounded-full transition-colors hover:cursor-pointer disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    <X />
                  </button>

                  {/* Product image */}
                  <Product.Image
                    src={item.product.images?.[0]?.imageUrl || "/"}
                    width={90}
                    onClick={() => handleProductClick(item)}
                    className="items-start"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Product.Name
                    name={item.product.name}
                    onClick={() => handleProductClick(item)}
                  />
                  <Product.VariantOptions variant={item.variant} />
                  <div className="flex gap-2 items-center">
                    <Label className="text-gray-600">Price:</Label>
                    <Product.Price price={item.price || item.product.price} />
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                {changeQuantity && (
                  <Product.QuantityControls
                    quantity={item.quantity}
                    onChangeQuantity={(newQty: number) =>
                      changeQuantity(item.productId, newQty, item.variantId)
                    }
                    isLoading={isChangingQuantity}
                  />
                )}
                {/* Product total price */}
                <Product.Total
                  priceColor="dark:text-gray-150 text-base"
                  showLabel={false}
                  amount={productTotal}
                />
              </div>
            </Product>
          );
        });

      default:
        return null;
    }
  };

  // Render the cart items based on the variant
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4">{renderCartItems()}</div>

      {/* Subtotal/Total based on variant */}
      {showTotal && (
        <div className={`${variant === "cart" ? "pt-10" : "pt-2"}`}>
          <Product.Total
            amount={total}
            label={showSubtotalLabel ? "Subtotal" : "Total"}
            labelSize="lg"
            priceSize="xl"
            priceColor="dark:text-gray-150 text-base"
            isLoading={isChangingQuantity}
          />
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
