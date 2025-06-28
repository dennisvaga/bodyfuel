/**
 * Custom hook for managing product cart interactions.
 *
 * This hook provides a product-focused abstraction over cart operations,
 * handling product-specific logic like variant validation, stock checking,
 * and local quantity management before committing to the global cart state.
 *
 * Key responsibilities:
 * - Manages local quantity state for UI interactions
 * - Validates product variants and stock availability
 * - Handles cart operations (add/update) with proper variant matching
 * - Provides loading states from the underlying cart context
 */

import { useState, useEffect } from "react";
import { ProductWithImageUrl } from "@repo/database/types/product";
import { useCart } from "../../cart/contexts/cartContext";

interface UseProductCartProps {
  product: ProductWithImageUrl | undefined | null;
  currentStock: number;
  selectedVariant?: any | null;
}

interface UseProductCartReturn {
  localQuantity: number;
  productInCart: any;
  handleAddToCart: () => Promise<void>;
  handleQuantityChange: (newQty: number) => void;
  isOutOfStock: boolean;
  canAddToCart: boolean;
  // Loading states from cart context
  isAddingToCart: boolean;
  isChangingQuantity: boolean;
  isLoading: boolean;
}

export const useProductCart = ({
  product,
  currentStock,
  selectedVariant,
}: UseProductCartProps): UseProductCartReturn => {
  const {
    addToCart,
    changeQuantity,
    cart,
    setOpenMiniCart,
    // Add these loading states
    isAddingToCart,
    isChangingQuantity,
    isLoading,
  } = useCart();
  const productInCart = cart?.cartItems?.find(
    (item) =>
      product &&
      item.productId === product.id &&
      (selectedVariant
        ? item.variantId === selectedVariant.id
        : !item.variantId)
  );

  const [localQuantity, setLocalQuantity] = useState(
    productInCart?.quantity || 1
  );

  // Sync local quantity with cart quantity when cart changes
  useEffect(() => {
    if (productInCart) {
      setLocalQuantity(productInCart.quantity);
    } else {
      setLocalQuantity(1);
    }
  }, [productInCart?.quantity]);

  const isOutOfStock = currentStock === 0;

  // Check if product has variants and if they are properly selected
  const hasVariants = !!(product?.options && product.options.length > 0);
  const variantRequiredButNotSelected = hasVariants && !selectedVariant;

  const canAddToCart = currentStock > 0 && !variantRequiredButNotSelected;

  const handleAddToCart = async () => {
    if (!product || !canAddToCart) {
      return;
    }

    if (productInCart) {
      // If product is already in cart, update the quantity to the new local quantity
      await changeQuantity(
        product.id,
        localQuantity,
        selectedVariant?.id || null
      );
      // Open mini cart after updating quantity
      setOpenMiniCart(true);
    } else {
      // If product is not in cart, add it with the local quantity
      const result = await addToCart(
        product,
        localQuantity,
        selectedVariant?.id || null
      );

      if (!result.success) {
        console.error("Error adding product to cart:", result.message);
        return;
      }
      // addToCart already opens the mini cart automatically
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);

    if (productInCart && product) {
      // If product is in cart, update cart quantity
      changeQuantity(product.id, validQty, selectedVariant?.id || null);
    } else {
      // Otherwise just update local state
      setLocalQuantity(validQty);
    }
  };

  return {
    localQuantity,
    productInCart,
    handleAddToCart,
    handleQuantityChange,
    isOutOfStock,
    canAddToCart,
    isAddingToCart,
    isChangingQuantity,
    isLoading,
  };
};
