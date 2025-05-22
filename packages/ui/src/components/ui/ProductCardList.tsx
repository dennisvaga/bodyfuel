'use client';

import React from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';
import { cn } from "#lib/cn";

export interface ProductCardListProps {
  products: Omit<ProductCardProps, 'className'>[];
  className?: string;
}

export function ProductCardList({ products, className }: ProductCardListProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      {products.map((product, index) => (
        <ProductCard
          key={`${product.slug}-${index}`}
          {...product}
        />
      ))}
    </div>
  );
}
