"use client";
import React, { JSX } from "react";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { CartVariants } from "../types/cartEnums";

interface CartItemSkeletonProps {
  variant?: CartVariants;
  count?: number;
  withBrigterBg?: boolean; // Prevent skeleton from blending with bg
}

/**
 * Dynamic ProductSkeleton that supports multiple layout variants
 */
const CartItemSkeleton = ({
  variant = CartVariants.cart,
  count = 3,
  withBrigterBg = false,
}: CartItemSkeletonProps) => {
  const bgClass = withBrigterBg ? "bg-gray-200" : "";

  // Skeleton variants specific to each variant
  // - This object structure is more efficient than switch, because we can pull only the specific record that we need.
  const skeletonVariants: Record<string, (key: number) => JSX.Element> = {
    // Full cart page skeleton with quantity controls
    cart: (key) => (
      <div key={key} className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <Skeleton className={`w-[80px] h-[80px] ${bgClass}`} />
          <div className="flex flex-col gap-2">
            <Skeleton className={`w-[100px] h-[20px] ${bgClass}`} />
            <Skeleton className={`w-[50px] h-[20px] ${bgClass}`} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-6">
          <div className="flex flex-row items-center gap-1">
            <Skeleton className={`h-5 w-[30px] ${bgClass}`} />
            <Skeleton className={`w-[50px] h-[50px] ${bgClass}`} />
            <Skeleton className={`h-5 w-[30px] ${bgClass}`} />
          </div>
          <Skeleton className={`h-5 w-[50px] ${bgClass}`} />
        </div>
      </div>
    ),

    // Checkout page skeleton (simpler)
    checkout: (key) => (
      <div key={key}>
        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row justify-between gap-2">
            <Skeleton className={`${bgClass} w-[80px] h-[80px]`} />
            <div className="flex flex-col gap-2">
              <Skeleton className={`${bgClass} h-5 w-[100px]`} />
              <Skeleton className={`${bgClass} h-5 w-[25px]`} />
            </div>
          </div>
        </div>
      </div>
    ),

    // Mini cart skeleton with different padding
    mini: (key) => (
      <div className="px-4 py-6" key={key}>
        <div className="flex flex-row py-4 gap-2">
          <Skeleton className={`w-[80px] h-[80px] ${bgClass}`} />
          <div className="flex flex-col gap-4">
            <Skeleton className={`h-5 w-[100px] ${bgClass}`} />
            <Skeleton className={`h-5 w-[30px] ${bgClass}`} />
          </div>
        </div>
      </div>
    ),
  };

  // Fallback to cart if invalid variant
  const renderSkeleton = skeletonVariants[variant] || skeletonVariants.cart;

  return <>{Array.from({ length: count }).map((_, index) => renderSkeleton?.(index))}</>;
};

/**
 * Total price skeleton, reusable across components
 */
export const TotalSkeleton = ({
  withBrigterBg = false,
  className = "",
}: {
  withBrigterBg?: boolean;
  className?: string;
}) => {
  const bgClass = withBrigterBg ? "bg-gray-200" : "";

  return (
    <div className={`flex justify-between ${className}`}>
      <Skeleton className={`${bgClass} h-5 w-[70px]`} />
      <Skeleton className={`${bgClass} h-5 w-[70px]`} />
    </div>
  );
};

export default CartItemSkeleton;
