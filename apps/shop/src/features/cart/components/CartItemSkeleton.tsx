"use client";
import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CartVariants } from "../types/cartEnums";
import { useSkeleton } from "@repo/ui/hooks/useSkeleton";

interface CartItemSkeletonProps {
  variant?: CartVariants;
  count?: number;
}

/**
 * Clean, maintainable skeleton using react-loading-skeleton
 * Automatically responsive and easy to maintain
 */
const CartItemSkeleton = ({
  variant = CartVariants.cart,
  count = 3,
}: CartItemSkeletonProps) => {
  const { skeletonTheme } = useSkeleton();

  const renderSkeleton = () => {
    switch (variant) {
      case CartVariants.cart:
        return (
          <div className="flex sm:flex-row flex-col gap-4 items-center border p-8 rounded-xl">
            <div className="flex flex-row gap-4">
              {/* Product image */}
              <Skeleton height={90} width={90} className="rounded-lg" />

              <div className="flex flex-col gap-2 min-w-0">
                {/* Product name */}
                <Skeleton height={20} width={120} />
                {/* Variant options */}
                <Skeleton height={16} width={80} />
                {/* Price label and value */}
                <div className="flex gap-2 items-center">
                  <Skeleton height={16} width={40} />
                  <Skeleton height={16} width={50} />
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 ml-auto">
              {/* Quantity controls */}
              <Skeleton height={40} width={120} className="rounded-xl" />
              {/* Product total */}
              <Skeleton height={20} width={60} />
            </div>
          </div>
        );

      case CartVariants.checkout:
        return (
          <div className="flex flex-row gap-4">
            {/* Product image */}
            <Skeleton height={80} width={80} className="rounded-lg border" />

            <div className="flex flex-col gap-1 flex-1">
              {/* Product name */}
              <Skeleton height={20} width="60%" />
              {/* Variant options */}
              <Skeleton height={16} width="40%" />
              {/* Price */}
              <Skeleton height={20} width="30%" />
            </div>
          </div>
        );

      case CartVariants.mini:
        return (
          <div>
            <div className="flex flex-row justify-between px-4 py-6">
              <div className="flex flex-row gap-2">
                {/* Product image */}
                <Skeleton height={100} width={100} className="rounded-lg" />
              </div>

              <div className="flex flex-col gap-2 text-end flex-1 ml-4">
                {/* Product name */}
                <Skeleton height={20} width="80%" className="ml-auto" />
                {/* Variant options */}
                <Skeleton height={16} width="60%" className="ml-auto" />
                {/* Price */}
                <Skeleton height={20} width="40%" className="ml-auto" />
                {/* Quantity controls */}
                <div className="flex justify-end mt-2">
                  <Skeleton height={32} width={120} className="rounded-xl" />
                </div>
              </div>
            </div>
            <div className="border-b border-gray-200 mt-8"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SkeletonTheme {...skeletonTheme}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </SkeletonTheme>
  );
};

/**
 * Total price skeleton using react-loading-skeleton
 */
export const TotalSkeleton = ({ className = "" }: { className?: string }) => {
  const { skeletonTheme } = useSkeleton();

  return (
    <SkeletonTheme {...skeletonTheme}>
      <div className={`flex justify-between ${className}`}>
        <Skeleton height={20} width={70} />
        <Skeleton height={20} width={70} />
      </div>
    </SkeletonTheme>
  );
};

export default CartItemSkeleton;
