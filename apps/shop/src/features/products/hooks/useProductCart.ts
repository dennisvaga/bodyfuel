/**
 * Custom hook for managing product cart interactions
 */

import { useState } from "react";
import { ProductWithImageUrl } from "@repo/database/types/product";
import { useCart } from "../../cart/contexts/cartContext";

interface UseProductCartProps {
  product: ProductWithImageUrl;
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
}

export const useProductCart = ({
  product,
  currentStock,
  selectedVariant,
}: UseProductCartProps): UseProductCartReturn => {
  const { addToCart, changeQuantity, cart } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  const productInCart = cart?.cartItems.find(
    (item) =>
      item.productId === product.id &&
      (selectedVariant
        ? item.variantId === selectedVariant.id
        : !item.variantId)
  );

  const isOutOfStock = currentStock === 0;

  // Check if product has variants and if they are properly selected
  const hasVariants = !!(product.options && product.options.length > 0);
  const variantRequiredButNotSelected = hasVariants && !selectedVariant;

  const canAddToCart = currentStock > 0 && !variantRequiredButNotSelected;

  const handleAddToCart = async () => {
    if (!product || !canAddToCart) {
      return;
    }

    const result = await addToCart(
      product,
      productInCart?.quantity || localQuantity,
      selectedVariant?.id || null
    );

    if (!result.success) {
      console.error("Error adding product to cart:", result.message);
      return;
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const validQty = Math.max(1, newQty);

    if (productInCart) {
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
  };
};
