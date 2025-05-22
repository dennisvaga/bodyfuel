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
  return (
    <div className="layout">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold">
          {productGroup?.name?.toUpperCase()}{" "}
        </h1>
        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <ProductSkeleton></ProductSkeleton>
          ) : (
            productGroup?.products?.map((product: any) => (
              <ProductCard
                key={product.id}
                product={product}
                variant={ProductCardVariants.default}
              ></ProductCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
