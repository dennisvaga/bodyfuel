/**
 * Product card component that used in 'Product Slider', 'Product Grid'
 */

"use client";
import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardContent } from "@repo/ui/components/ui/card";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { useCart } from "../../cart/contexts/cartContext";
import Product from "./Product";
import ProductReviews from "./ProductReviews";
import { ProductCardVariants } from "../types/productCard";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast";
import { useMediaQuery } from "@repo/ui/hooks/use-media-query";
import { useProductVariants } from "../hooks/useProductVariants";
import { useProductCart } from "../hooks/useProductCart";

interface ProductCardProps {
  product: ProductWithImageUrl;
  variant?: ProductCardVariants;
}

const ProductCard = ({
  product,
  variant = ProductCardVariants.default,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  // Use focused hooks for variant and cart logic
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

  // Derived state
  const hasVariants = !!(product.options && product.options.length > 0);

  const handleAddToCartClick = async () => {
    if (canAddToCart) {
      await handleAddToCart();
    } else {
      toast({
        variant: "destructive",
        description: "Please select product options before adding to cart.",
      });
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  // Adjust sizing based on variant
  const isSlider = variant === ProductCardVariants.slider;

  // Use media query to determine if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Set image width based on screen size
  const imageWidth = isMobile ? 160 : 240;

  return (
    <Card
      className={`rounded-xl shadow-sm bg-card group overflow-hidden flex flex-col justify-between ${
        isSlider ? "min-w-[200px] lg:flex-1 lg:min-w-0" : "w-full"
      }`}
    >
      <CardHeader className={`p-6 overflow-hidden`}>
        <Product.Image
          src={product.images?.[0]?.imageUrl || "/"}
          onClick={handleCardClick}
          width={imageWidth}
          hoverEffect
        />
      </CardHeader>
      <CardContent className={`flex flex-col relative p-4 gap-1`}>
        <Product.Brand brand={product.brand ?? ""} />
        <Product.Name onClick={handleCardClick} name={product.name ?? ""} />
        <ProductReviews productId={product.id} className="my-1" />
        <Product.Price price={currentPrice ?? 0} />

        {/* Variant Selector - shown when product has variants */}
        {hasVariants && (
          <div className="mt-2 mb-3">
            <Product.VariantSelector
              options={product.options}
              selectedOptions={selectedOptions}
              onSelectionChange={handleVariantSelection}
            />
          </div>
        )}

        {/* Desktop "Add to cart" button - only show when no variants or variant is selected */}
        {!hasVariants || selectedVariant ? (
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              if (!isOutOfStock && canAddToCart) {
                handleAddToCartClick();
              }
            }}
            className={`absolute hover:bg-primary bottom-0 left-0 right-0 font-semibold transition-all duration-300 ease-out transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block ${
              isOutOfStock || !canAddToCart
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          />
        ) : (
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="absolute hover:bg-primary bottom-0 left-0 right-0 font-semibold transition-all duration-300 ease-out transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block"
          >
            Choose Options
          </Product.AddToCartButton>
        )}

        {/* Mobile cart icon - only show when no variants or variant is selected */}
        {!hasVariants || selectedVariant ? (
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              if (!isOutOfStock && canAddToCart) {
                handleAddToCartClick();
              }
            }}
            variant="icon"
            className={`rounded-xl md:hidden mt-2 ${
              isOutOfStock || !canAddToCart
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          />
        ) : (
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="rounded-xl md:hidden mt-2"
          >
            Choose Options
          </Product.AddToCartButton>
        )}

        {/* Out of stock indicator */}
        {isOutOfStock && (
          <div className="text-sm text-destructive font-medium mt-1">
            Out of stock
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
