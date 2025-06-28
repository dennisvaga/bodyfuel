import React, { createContext, useContext, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import type { CartWithItems } from "@repo/database/types/cart";
import { ApiResult, QUERY_KEYS, useFetchQuery } from "@repo/shared";

interface CartContextType {
  cart: CartWithItems | undefined;
  total: number;
  isLoading: boolean;
  refetch: Function;
  addToCart: (
    product: ProductWithImageUrl,
    quantity?: number,
    variantId?: number | null
  ) => Promise<ApiResult<CartWithItems>>;
  changeQuantity: (
    productId: number,
    change: number,
    variantId?: number | null
  ) => Promise<ApiResult<CartWithItems>>;
  removeFromCart: (
    productId: number,
    variantId?: number | null
  ) => Promise<ApiResult<CartWithItems>>;
  openMiniCart: boolean;
  setOpenMiniCart: (open: boolean) => void;
  // Loading states for mutations
  isAddingToCart: boolean;
  isChangingQuantity: boolean;
  isRemovingFromCart: boolean;
}

// Context must be used here to share `openMiniCart` between components
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const [openMiniCart, setOpenMiniCart] = useState(false);

  // Fetch the cart
  const {
    data: cart,
    isLoading,
    refetch,
    isFetching,
  } = useFetchQuery<CartWithItems>({
    queryKey: QUERY_KEYS.CART,
    serviceFn: cartService.getCart,
  });

  // Compute total
  const total = useMemo(() => {
    const newTotal =
      cart?.cartItems?.reduce(
        (sum, item) => sum + (item.price || item.product.price) * item.quantity,
        0
      ) ?? 0;

    return Number(newTotal.toFixed(2));
  }, [cart]);

  // Mutations
  const changeQuantityMutation = useMutation({
    mutationFn: (variables: {
      productId: number;
      change: number;
      variantId?: number | null;
    }) =>
      cartService.changeQuantity(
        variables.productId,
        variables.change,
        variables.variantId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (variables: {
      product: ProductWithImageUrl;
      quantity: number;
      variantId?: number | null;
    }) =>
      cartService.addToCart(
        variables.product,
        variables.quantity,
        variables.variantId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (variables: { productId: number; variantId?: number | null }) =>
      cartService.removeFromCart(variables.productId, variables.variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
    },
  });

  // Functions matching the original signatures
  const addToCart = async (
    product: ProductWithImageUrl,
    quantity: number = 1,
    variantId?: number | null
  ) => {
    const result = await addToCartMutation.mutateAsync({
      product,
      quantity,
      variantId,
    });
    await refetch();
    setOpenMiniCart(true);
    return result;
  };

  const removeFromCart = async (
    productId: number,
    variantId?: number | null
  ) => {
    const result = await removeFromCartMutation.mutateAsync({
      productId,
      variantId,
    });
    await refetch();
    return result;
  };

  const changeQuantity = async (
    productId: number,
    change: number,
    variantId?: number | null
  ) => {
    const result = await changeQuantityMutation.mutateAsync({
      productId,
      change,
      variantId,
    });
    await refetch();
    return result;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        isLoading,
        refetch,
        addToCart,
        changeQuantity,
        removeFromCart,
        openMiniCart,
        setOpenMiniCart,
        // Loading states for mutations - include fetching state for ongoing operations
        isAddingToCart: addToCartMutation.isPending || isFetching,
        isChangingQuantity: changeQuantityMutation.isPending || isFetching,
        isRemovingFromCart: removeFromCartMutation.isPending || isFetching,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
