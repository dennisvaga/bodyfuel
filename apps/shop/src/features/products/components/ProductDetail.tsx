/**
 * Product detail (Single) component rendered for each individual product.
 * Built using the <Product /> compound component.
 */

import { ProductWithImageUrl } from "@repo/database/types/product";
import React from "react";
import { useProductVariants } from "../hooks/useProductVariants";
import { useProductCart } from "../hooks/useProductCart";
import Product from "@repo/ui/components/features/products/Product";
import ProductSkeleton from "./ProductSkeleton";
import { ProductCardVariants } from "../types/productCard";

interface ProductDetailProps {
  product: ProductWithImageUrl | undefined | null;
  isLoading: boolean;
}

const ProductDetail = ({ product, isLoading }: ProductDetailProps) => {
  // ALL HOOKS MUST BE CALLED FIRST - before any early returns
  const {
    selectedOptions,
    selectedVariant,
    currentPrice,
    currentStock,
    handleVariantSelection,
  } = useProductVariants({ product });

  const {
    localQuantity,
    productInCart,
    handleAddToCart,
    handleQuantityChange,
    isOutOfStock,
    canAddToCart,
  } = useProductCart({ product, currentStock, selectedVariant });

  // Show skeleton while loading or when product is undefined - AFTER hooks
  if (isLoading || !product) {
    return <ProductSkeleton variant={ProductCardVariants.detail} count={1} />;
  }

  // Derived state
  const hasVariants = !!(product.options && product.options.length > 0);

  return (
    <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Product Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Product.Image
          width={550}
          src={product.images?.[0].imageUrl || "/"}
          className="max-w-full h-auto object-contain"
        />
      </div>
      {/* Product Details */}
      <div className="flex flex-col relative w-full lg:w-1/2">
        <div className="flex flex-col gap-3">
          <Product.Name
            className="text-2xl md:text-3xl font-bold"
            name={product.name}
          />
          <Product.Brand
            className="text-lg md:text-xl font-medium"
            brand={product?.brand ?? ""}
          />
          <Product.Price
            className="text-lg md:text-xl font-medium"
            price={currentPrice}
          />
          <Product.Description
            className="text-sm md:text-md"
            description={product.description ?? ""}
          />

          {/* Variant Selector */}
          {hasVariants && (
            <Product.VariantSelector
              options={product.options}
              selectedOptions={selectedOptions}
              onSelectionChange={handleVariantSelection}
              className="mt-4"
            />
          )}

          {/* Stock Information */}
          {currentStock > 0 && (
            <div className="text-sm text-muted-foreground">
              {currentStock} in stock
            </div>
          )}

          {isOutOfStock && (
            <div className="text-sm text-destructive font-medium">
              Out of stock
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 mt-8 md:mt-16 md:items-center">
          <Product.QuantityControls
            quantity={
              productInCart !== undefined
                ? productInCart.quantity
                : localQuantity
            }
            onChangeQuantity={handleQuantityChange}
          />
          <Product.AddToCartButton
            onClick={(e: any) => {
              if (canAddToCart) {
                handleAddToCart();
                e.stopPropagation();
              }
            }}
            className={`w-full font-semibold ${
              canAddToCart
                ? "hover:cursor-pointer hover:bg-primary"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {hasVariants && !selectedVariant
              ? "Please Select Options"
              : "Add to Cart"}
          </Product.AddToCartButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
