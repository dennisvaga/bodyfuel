/**
 * Slider component that renders multiple Product cards.
 * Uses the <Product /> compound component for each item.
 */

import { UseQueryResult } from "@tanstack/react-query";
import React from "react";
import ProductCard from "./ProductCard";
import { ProductWithImageUrl } from "@repo/database/types/product";
import { ProductCardVariants } from "../types/productCard";
import Link from "next/link";
import { ProductGroupType } from "../types/productGroup";
import { ChevronRight } from "lucide-react";
import { StaticImageData } from "next/image";
import ProductSliderSkeleton from "./ProductSliderSkeleton";

interface ProductSliderProps<T = any> {
  productGroup: T;
  groupType: ProductGroupType;
  groupImage?: StaticImageData;
  isLoading?: boolean;
  productCount?: number;
}

const ProductSlider = ({
  productGroup,
  groupType,
  groupImage,
  isLoading = false,
  productCount = 4,
}: ProductSliderProps) => {
  // Show skeleton while loading
  if (isLoading) {
    return <ProductSliderSkeleton productCount={productCount} />;
  }

  return (
    <div className="w-full bg-background">
      <div className="flex flex-col gap-8">
        {/* Modern heading with gradient text */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-row items-center gap-3">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {productGroup?.name.toUpperCase()}
            </h2>
            <ChevronRight
              size={32}
              strokeWidth={2.5}
              className="text-primary/80"
            />
          </div>
          <Link
            href={`/${groupType}/${productGroup?.slug}`}
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <span>View All Products</span>
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Modern layout with better spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
          {/* Enhanced view all card */}
          <div
            className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 min-h-[200px] lg:min-h-[300px] group"
            style={{
              backgroundImage: `url(${groupImage?.src})`,
            }}
          >
            <Link
              href={`/${groupType}/${productGroup?.slug}`}
              className="flex flex-col justify-center items-center w-full h-full relative z-10 p-6 text-center group-hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/40 z-0"></div>
              <div className="relative z-10 space-y-3">
                <div className="text-lg font-medium text-white/90">
                  Explore our
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {productGroup?.name}
                </h3>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-medium">
                  <span>Shop Now</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          {/* Product cards with better grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {productGroup &&
              productGroup?.products.map((product: ProductWithImageUrl) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={ProductCardVariants.slider}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
