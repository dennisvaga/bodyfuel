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
  variant = ProductCardVariants.grid,
  count = 8,
  withBrigterBg = false,
}: ProductSkeletonProps) => {
  const bgClass = withBrigterBg ? "bg-muted/50 dark:bg-muted/30" : "";

  // Skeleton variants specific to each variant
  // - This object structure is more efficient than switch, because we can pull only the specific record that we need.
  const skeletonVariants: Record<string, (key: number) => JSX.Element> = {
    // Grid product card (grid view)
    grid: (key) => (
      <div
        key={key}
        className="rounded-xl shadow-sm bg-card overflow-hidden flex flex-col justify-between w-full"
      >
        {/* Card Header - empty space for image */}
        <div className="p-6 overflow-hidden">
          <div className="w-[160px] md:w-[240px] h-[160px] md:h-[240px]" />
        </div>

        {/* Card Content */}
        <div className="flex flex-col relative p-4 gap-1">
          <Skeleton className={`h-4 w-[80px] ${bgClass}`} /> {/* Brand */}
          <Skeleton className={`h-5 w-[120px] ${bgClass}`} /> {/* Name */}
          <Skeleton className={`h-4 w-[60px] ${bgClass}`} /> {/* Reviews */}
          <Skeleton className={`h-5 w-[70px] ${bgClass}`} /> {/* Price */}
          {/* Mobile button skeleton */}
          <Skeleton
            className={`h-10 w-full mt-2 rounded-xl md:hidden ${bgClass}`}
          />
        </div>
      </div>
    ),

    // Slider product card (horizontal slider)
    slider: (key) => (
      <div key={key} className="min-w-[200px] lg:flex-1 lg:min-w-0">
        <div className="rounded-xl shadow-sm bg-card overflow-hidden flex flex-col justify-between">
          {/* Card Header with image */}
          <div className="p-6 overflow-hidden">
            <Skeleton
              className={`w-[160px] md:w-[240px] h-[160px] md:h-[240px] rounded-xl ${bgClass}`}
            />
          </div>

          {/* Card Content */}
          <div className="flex flex-col relative p-4 gap-1">
            <Skeleton className={`h-4 w-[80px] ${bgClass}`} /> {/* Brand */}
            <Skeleton className={`h-5 w-[120px] ${bgClass}`} /> {/* Name */}
            <Skeleton className={`h-4 w-[60px] ${bgClass}`} /> {/* Reviews */}
            <Skeleton className={`h-5 w-[70px] ${bgClass}`} /> {/* Price */}
            {/* Mobile button skeleton */}
            <Skeleton
              className={`h-10 w-full mt-2 rounded-xl md:hidden ${bgClass}`}
            />
          </div>
        </div>
      </div>
    ),

    // Product detail page skeleton
    detail: (key) => (
      <div
        key={key}
        className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Product Image Skeleton */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <Skeleton
            className={`w-[550px] h-[550px] max-w-full rounded-xl ${bgClass}`}
          />
        </div>

        {/* Product Details Skeleton */}
        <div className="flex flex-col relative w-full lg:w-1/2">
          <div className="flex flex-col gap-3">
            {/* Product Name */}
            <Skeleton
              className={`h-8 md:h-9 w-[300px] max-w-full ${bgClass}`}
            />

            {/* Brand */}
            <Skeleton className={`h-6 md:h-7 w-[150px] ${bgClass}`} />

            {/* Price */}
            <Skeleton className={`h-6 md:h-7 w-[100px] ${bgClass}`} />

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Skeleton className={`h-4 w-full ${bgClass}`} />
              <Skeleton className={`h-4 w-[80%] ${bgClass}`} />
              <Skeleton className={`h-4 w-[60%] ${bgClass}`} />
            </div>

            {/* Variant Selector (optional) */}
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton className={`h-5 w-[120px] ${bgClass}`} />
              <div className="flex gap-2">
                <Skeleton className={`h-10 w-16 rounded ${bgClass}`} />
                <Skeleton className={`h-10 w-16 rounded ${bgClass}`} />
                <Skeleton className={`h-10 w-16 rounded ${bgClass}`} />
              </div>
            </div>

            {/* Stock Information */}
            <Skeleton className={`h-4 w-[100px] ${bgClass}`} />
          </div>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 mt-8 md:mt-16 md:items-center">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Skeleton className={`h-10 w-10 rounded ${bgClass}`} />
              <Skeleton className={`h-10 w-16 rounded ${bgClass}`} />
              <Skeleton className={`h-10 w-10 rounded ${bgClass}`} />
            </div>

            {/* Add to Cart Button */}
            <Skeleton className={`h-10 w-full rounded ${bgClass}`} />
          </div>
        </div>
      </div>
    ),
  };

  // Fallback to grid if invalid variant
  const renderSkeleton = skeletonVariants[variant] || skeletonVariants.grid;

  return Array.from({ length: count }).map((_, index) => renderSkeleton(index));
};

export default ProductSkeleton;
