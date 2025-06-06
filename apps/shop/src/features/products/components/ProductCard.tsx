/**
 * Product card component that used in 'Product Slider', 'Product Grid'
 */

"use client";
import React from "react";
import { Card, CardHeader, CardContent } from "@repo/ui/components/ui/card";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { useCart } from "../../cart/contexts/cartContext";
import Product from "./Product";
import { ProductCardVariants } from "../types/productCard";
import { useRouter } from "next/navigation";
import { useToast } from "@repo/ui/hooks/use-toast";

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

  const handleAddToCart = async () => {
    if (product) {
      const result = await addToCart(product);

      if (!result.success) {
        toast({
          variant: "destructive",
          description: "There was a problem adding the product to the cart.",
        });
      }
    }
  };

  const handleCardClick = () => {
    router.push(`/products/${product.slug}`);
  };

  // Adjust sizing based on variant
  const isSlider = variant === ProductCardVariants.slider;

  return (
    <Card
      className={`rounded-xl shadow-none bg-card group overflow-hidden flex flex-col justify-between ${
        isSlider ? "min-w-[200px] lg:flex-1 lg:min-w-0" : "w-full"
      }`}
    >
      <CardHeader className={`p-6 overflow-hidden`}>
        <Product.Image
          src={product.images?.[0]?.imageUrl || "/"}
          onClick={handleCardClick}
          width={240}
          hoverEffect
        />
      </CardHeader>
      <CardContent className={`flex flex-col relative p-4 gap-1`}>
        <Product.Brand brand={product.brand ?? ""} />
        <Product.Name onClick={handleCardClick} name={product.name ?? ""} />
        <Product.Price price={product.price ?? 0} />
        {/* Desktop "Add to cart" button */}
        <Product.AddToCartButton
          onClick={(e: any) => {
            handleAddToCart();
          }}
          className={`absolute hover:bg-primary bottom-0 left-0 right-0 rounded-md font-semibold transition-all duration-300 ease-out transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:block`}
        />
        {/* Mobile cart icon */}
        <Product.AddToCartButton
          onClick={handleAddToCart}
          variant="icon"
          className={`rounded-xl md:hidden mt-2`}
        />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
