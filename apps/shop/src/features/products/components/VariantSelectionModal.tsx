/**
 * Modal for selecting product variants in ProductCard
 */

"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { ProductWithImageUrl } from "@repo/database/types/product";
import Product from "@repo/ui/components/features/products/Product";
import { useProductVariants } from "../hooks/useProductVariants";
import { useProductCart } from "../hooks/useProductCart";

interface VariantSelectionModalProps {
  product: ProductWithImageUrl;
  isOpen: boolean;
  onClose: () => void;
}

const VariantSelectionModal = ({
  product,
  isOpen,
  onClose,
}: VariantSelectionModalProps) => {
  const {
    selectedOptions,
    selectedVariant,
    currentPrice,
    currentStock,
    handleVariantSelection,
    hasVariants,
    allOptionsSelected,
  } = useProductVariants({ product });

  const {
    localQuantity,
    handleAddToCart,
    handleQuantityChange,
    isOutOfStock,
    canAddToCart,
    productInCart,
    isAddingToCart,
    isChangingQuantity,
    isLoading,
  } = useProductCart({
    product,
    currentStock,
    selectedVariant,
  });

  const buttonLoading = productInCart ? isChangingQuantity : isAddingToCart;

  const handleAddToCartClick = async () => {
    if (canAddToCart && allOptionsSelected) {
      await handleAddToCart();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Select Options</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex gap-4">
            <Product.Image
              src={product.images?.[0]?.imageUrl || "/"}
              width={80}
              className="rounded-lg"
            />
            <div className="flex-1 space-y-2">
              <div>
                <Product.Name name={product.name} className="font-semibold" />
                <Product.Brand
                  brand={product.brand ?? ""}
                  className="text-sm text-muted-foreground"
                />
              </div>

              <Product.Price price={currentPrice} className="font-bold" />
            </div>
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <Product.VariantSelector
              options={product.options}
              selectedOptions={selectedOptions}
              onSelectionChange={handleVariantSelection}
            />
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Quantity:</span>
            <Product.QuantityControls
              quantity={localQuantity}
              onChangeQuantity={handleQuantityChange}
            />
          </div>

          {/* Stock Information */}
          {currentStock > 0 && allOptionsSelected && (
            <div className="text-sm text-muted-foreground">
              {currentStock} in stock
            </div>
          )}

          {isOutOfStock && allOptionsSelected && (
            <div className="text-sm text-destructive font-medium">
              Out of stock
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 sm:flex-row flex-col">
          <Product.AddToCartButton
            onClick={handleAddToCartClick}
            disabled={!allOptionsSelected || !canAddToCart}
            isLoading={buttonLoading}
            className="flex-1"
          >
            {!allOptionsSelected
              ? "Select Options"
              : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
          </Product.AddToCartButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default VariantSelectionModal;
