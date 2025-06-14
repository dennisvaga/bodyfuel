/**
 * Product card component that used in 'Product Slider', 'Product Grid'
 */

"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@repo/ui/components/ui/card";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import Product from "@repo/ui/components/features/products/Product";
import ProductReviews from "./ProductReviews";
import { ProductCardVariants } from "../types/productCard";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@repo/ui/hooks/use-media-query";
import { useProductCart } from "../hooks/useProductCart";
import { useProductVariants } from "../hooks/useProductVariants";
import VariantSelectionModal from "./VariantSelectionModal";
import { useCart } from "../../cart/contexts/cartContext";

interface ProductCardProps {
  product: ProductWithImageUrl;
  variant?: ProductCardVariants;
}

const ProductCard = ({
  product,
  variant = ProductCardVariants.grid,
}: ProductCardProps) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get loading states from cart context
  const { isAddingToCart } = useCart();

  // Use the consolidated hook for variant management (no auto-selection for ProductCard)
  const { hasVariants, currentStock, selectedVariant, currentPrice } =
    useProductVariants({ product });

  // Use cart logic with proper variant data
  const { handleAddToCart, isOutOfStock, canAddToCart } = useProductCart({
    product,
    currentStock,
    selectedVariant,
  });

  const handleAddToCartClick = async () => {
    if (hasVariants) {
      // Open modal for variant selection
      setIsModalOpen(true);
    } else {
      // Direct add to cart for products without variants
      if (canAddToCart) {
        await handleAddToCart();
      }
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
    <>
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
          <Product.Price price={currentPrice} />

          {/* Desktop button */}
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              if (!isOutOfStock) {
                handleAddToCartClick();
              }
            }}
            className={`absolute hover:bg-primary bottom-0 left-0 right-0 font-semibold transition-all duration-300 ease-out transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block ${
              isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            isLoading={isAddingToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock
              ? "Out of Stock"
              : hasVariants
                ? "Select Options"
                : "Add to Cart"}
          </Product.AddToCartButton>

          {/* Mobile button */}
          <Product.AddToCartButton
            onClick={(e: any) => {
              e.stopPropagation();
              if (!isOutOfStock) {
                handleAddToCartClick();
              }
            }}
            className={`rounded-xl md:hidden mt-2 ${
              isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            isLoading={isAddingToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock
              ? "Out of Stock"
              : hasVariants
                ? "Select Options"
                : "Add to Cart"}
          </Product.AddToCartButton>

          {/* Out of stock indicator */}
          {isOutOfStock && (
            <div className="text-sm text-destructive font-medium mt-1">
              Out of stock
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
