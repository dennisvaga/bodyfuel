/**
 * Grid component that renders multiple Product Cards.
 * Uses the <Product /> compound component for each item.
 */

"use client";

import ProductCard from "@/src/features/products/components/ProductCard";
import React from "react";
import { ProductCardVariants } from "../types/productCard";
import ProductSkeleton from "./ProductSkeleton";

interface ProductGridProps<T = any> {
  productGroup: T;
  isLoading: boolean;
}

const ProductGrid = ({ productGroup, isLoading }: ProductGridProps) => {
  // Handle both cases: array of products directly, or object with products property
  const products = Array.isArray(productGroup)
    ? productGroup
    : productGroup?.products;
  const title = Array.isArray(productGroup)
    ? "ALL PRODUCTS"
    : productGroup?.name?.toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-extrabold">{title} </h1>
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <ProductSkeleton variant={ProductCardVariants.grid} count={8} />
        ) : (
          products?.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={ProductCardVariants.grid}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
