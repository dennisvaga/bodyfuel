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
    <div className="flex flex-col xl:items-center">
      <div className="flex flex-col gap-6">
        {/* Group heading */}
        <div className="flex flex-row items-center">
          <h2 className="text-3xl font-extrabold">
            {productGroup?.name.toUpperCase()}
          </h2>
          <ChevronRight
            size={27}
            strokeWidth={3}
            color="hsl(var(--primary))"
          ></ChevronRight>
        </div>

        {/* Group image & link to 'view all' */}
        <div className="flex flex-row gap-3 overflow-x-auto pb-2">
          {/* View all card - */}
          <div
            className="relative bg-cover bg-center min-w-[200px] border rounded-xl"
            style={{
              backgroundImage: `url(${groupImage?.src})`,
            }}
          >
            <Link
              href={`/${groupType}/${productGroup?.slug}`}
              className="p-3 text-center flex flex-col justify-center items-center w-full h-full relative z-10"
            >
              <div className="absolute inset-0 bg-black opacity-60 z-0 rounded-xl"></div>
              <div className="text-2xl font-normal text-white relative z-10">
                View all
              </div>
              <h3 className="text-4xl text-white relative z-10">
                {productGroup?.name}
              </h3>
            </Link>
          </div>

          {/* Group items */}
          <div className="flex flex-row gap-3 -order-1 sm:order-1">
            {productGroup &&
              productGroup?.products.map((product: ProductWithImageUrl) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={ProductCardVariants.slider}
                ></ProductCard>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
