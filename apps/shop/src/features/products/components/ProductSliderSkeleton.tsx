"use client";
import React from "react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import ProductSkeleton from "./ProductSkeleton";
import { ProductCardVariants } from "../types/productCard";

interface ProductSliderSkeletonProps {
  productCount?: number;
  withBrigterBg?: boolean;
  showViewAll?: boolean;
}

/**
 * ProductSliderSkeleton - Special skeleton for product slider sections
 * This includes the section title, "view all" image area, and product cards
 */
const ProductSliderSkeleton = ({
  productCount = 4,
  withBrigterBg = false,
  showViewAll = true,
}: ProductSliderSkeletonProps) => {
  const bgClass = withBrigterBg ? "bg-muted/50 dark:bg-muted/30" : "";

  return (
    <div className="flex flex-col xl:items-center bg-background">
      <div className="flex flex-col gap-6">
        {/* Group heading skeleton */}
        <div className="flex flex-row items-center">
          <Skeleton className={`h-8 w-[180px] ${bgClass}`} />
          <Skeleton className={`h-7 w-7 ml-2 ${bgClass}`} />
        </div>

        {/* Content skeleton */}
        <div className="flex flex-row gap-3 overflow-x-auto">
          {/* Group image & "view all" skeleton */}
          {showViewAll && (
            <Skeleton className={`min-w-[200px] h-[300px] ${bgClass}`} />
          )}

          {/* Product cards skeleton */}
          <div className="flex flex-row gap-3 -order-1 sm:order-1">
            <ProductSkeleton
              variant={ProductCardVariants.slider}
              count={productCount}
              withBrigterBg={withBrigterBg}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSliderSkeleton;
