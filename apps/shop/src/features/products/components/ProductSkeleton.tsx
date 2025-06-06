/**
 * Dynamic skeleton loader for product components.
 * Shows placeholders while data is loading, with support for multiple display variants.
 */

"use client";
import React, { JSX } from "react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { ProductCardVariants } from "../types/productCard";

interface ProductSkeletonProps {
  variant?: ProductCardVariants;
  count?: number;
  withBrigterBg?: boolean; // Prevent skeleton from blending with bg
}

/**
 * Dynamic ProductSkeleton that supports multiple layout variants
 * Shows a placeholder while data is loading.
 */
const ProductSkeleton = ({
  variant = ProductCardVariants.default,
  count = 6,
  withBrigterBg = false,
}: ProductSkeletonProps) => {
  const bgClass = withBrigterBg ? "bg-muted/50 dark:bg-muted/30" : "";

  // Skeleton variants specific to each variant
  // - This object structure is more efficient than switch, because we can pull only the specific record that we need.
  const skeletonVariants: Record<string, (key: number) => JSX.Element> = {
    // Default product card (grid view)
    default: (key) => (
      <div key={key}>
        <Skeleton className={`w-[340px] h-[280px] rounded-xl ${bgClass}`} />
        <div className="flex flex-col gap-2 px-0 py-4">
          <Skeleton className={`h-5 w-[100px] ${bgClass}`} />
          <Skeleton className={`h-5 w-[100px] ${bgClass}`} />
          <Skeleton className={`h-5 w-[100px] ${bgClass}`} />
        </div>
      </div>
    ),

    // Slider product card (horizontal slider)
    slider: (key) => (
      <div key={key} className="min-w-[260px]">
        <Skeleton className={`w-[260px] h-[260px] rounded-xl ${bgClass}`} />
        <div className="flex flex-col gap-2 px-0 py-4">
          <Skeleton className={`h-4 w-[80px] ${bgClass}`} />
          <Skeleton className={`h-5 w-[120px] ${bgClass}`} />
          <Skeleton className={`h-4 w-[70px] ${bgClass}`} />
        </div>
      </div>
    ),
  };

  // Fallback to default if invalid variant
  const renderSkeleton = skeletonVariants[variant] || skeletonVariants.default;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
    </>
  );
};

export default ProductSkeleton;
