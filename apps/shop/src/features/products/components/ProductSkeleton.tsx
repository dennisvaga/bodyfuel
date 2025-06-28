/**
 * Dynamic skeleton loader for product components using react-loading-skeleton.
 * Shows placeholders while data is loading, with support for multiple display variants.
 * Much more maintainable and automatically responsive.
 */

"use client";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ProductCardVariants } from "../types/productCard";
import { useSkeleton } from "@repo/ui/hooks/useSkeleton";

interface ProductSkeletonProps {
  variant?: ProductCardVariants;
  count?: number;
}

/**
 * Clean, maintainable skeleton using react-loading-skeleton
 * Automatically responsive and easy to maintain
 */
const ProductSkeleton = ({
  variant = ProductCardVariants.grid,
  count = 8,
}: ProductSkeletonProps) => {
  const { skeletonTheme } = useSkeleton();

  const renderSkeleton = () => {
    switch (variant) {
      case ProductCardVariants.grid:
        return (
          <div className="rounded-xl shadow-sm bg-card overflow-hidden flex flex-col justify-between w-full">
            {/* Product Image - Empty space since Product.Image has its own skeleton */}
            <div className="p-6 overflow-hidden">
              <div className="aspect-square w-full max-w-[240px] mx-auto" />
            </div>

            {/* Product Details */}
            <div className="flex flex-col relative p-4 gap-2">
              <Skeleton height={16} width="60%" /> {/* Brand */}
              <Skeleton height={20} width="80%" /> {/* Name */}
              <Skeleton height={16} width="40%" /> {/* Reviews */}
              <Skeleton height={20} width="50%" /> {/* Price */}
              {/* Mobile button */}
              <div className="md:hidden mt-2">
                <Skeleton height={40} width="100%" className="rounded-xl" />
              </div>
            </div>
          </div>
        );

      case ProductCardVariants.slider:
        return (
          <div className="flex flex-col xl:items-center w-full">
            <div className="flex flex-col gap-6 w-full">
              {/* Group heading skeleton */}
              <div className="flex flex-row items-center">
                <Skeleton height={36} width={200} />
                <Skeleton height={27} width={27} className="ml-2" />
              </div>

              {/* Group image & products container */}
              <div className="flex flex-row gap-3 overflow-x-auto lg:overflow-x-visible pb-2 w-full">
                {/* View all card skeleton */}
                <div className="relative max-w-[230px] lg:w-1/3 lg:min-w-0 border rounded-xl flex-shrink-0 h-[400px]">
                  <Skeleton height="100%" width="100%" className="rounded-xl" />
                </div>

                {/* Product cards skeleton */}
                <div className="flex flex-row gap-3 -order-1 sm:order-1 lg:flex-1 lg:w-2/3">
                  {Array.from({ length: count }).map((_, index) => (
                    <div
                      key={index}
                      className="min-w-[200px] lg:flex-1 lg:min-w-0"
                    >
                      <div className="rounded-xl shadow-sm bg-card overflow-hidden flex flex-col justify-between h-[400px]">
                        {/* Product Image - Empty space since Product.Image has its own skeleton */}
                        <div className="p-6 overflow-hidden flex-1 flex items-center justify-center">
                          <div className="w-full aspect-square max-w-[240px]" />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-col relative p-4 gap-2">
                          <Skeleton height={16} width="60%" /> {/* Brand */}
                          <Skeleton height={20} width="80%" /> {/* Name */}
                          <Skeleton height={16} width="40%" /> {/* Reviews */}
                          <Skeleton height={20} width="50%" /> {/* Price */}
                          {/* Mobile button */}
                          <div className="md:hidden mt-2">
                            <Skeleton
                              height={40}
                              width="100%"
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case ProductCardVariants.detail:
        return (
          <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-8 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Product Image - Empty space since Product.Image has its own skeleton */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="aspect-square w-full max-w-[550px]" />
            </div>

            {/* Product Details */}
            <div className="flex flex-col relative w-full lg:w-1/2">
              <div className="flex flex-col gap-3">
                {/* Product Name - text-2xl md:text-3xl */}
                <Skeleton height={40} width="85%" />

                {/* Brand - text-lg md:text-xl */}
                <Skeleton height={24} width="35%" />

                {/* Price - text-lg md:text-xl */}
                <Skeleton height={28} width="25%" />

                {/* Description - text-sm md:text-md */}
                <Skeleton height={20} width="90%" />

                {/* Flavor Label */}
                <div className="mt-4">
                  <Skeleton height={20} width="15%" />
                </div>

                {/* Flavor Dropdown */}
                <Skeleton height={48} width="100%" className="rounded" />

                {/* Stock Information */}
                <Skeleton height={20} width="30%" />
              </div>

              {/* Action Controls */}
              <div className="flex flex-row gap-4 items-center mt-8">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Skeleton height={40} width={40} className="rounded" />
                  <Skeleton height={40} width={60} className="rounded" />
                  <Skeleton height={40} width={40} className="rounded" />
                </div>

                {/* Add to Cart Button */}
                <Skeleton height={48} width={200} className="rounded" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content =
    variant === ProductCardVariants.slider
      ? renderSkeleton()
      : Array.from({ length: count }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ));

  return <SkeletonTheme {...skeletonTheme}>{content}</SkeletonTheme>;
};

export default ProductSkeleton;
