'use client';

import React from 'react';
import { cn } from "#lib/cn";

export interface ProductCardProps {
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  slug: string;
  className?: string;
}

export function ProductCard({
  name,
  price,
  description = 'No description available',
  imageUrl,
  slug,
  className,
}: ProductCardProps) {
  return (
    <div className={cn(
      "flex border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="w-20 h-20 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to default image if the product image fails to load
            (e.target as HTMLImageElement).src = '/media/blankImage.jpg';
          }}
        />
      </div>
      <div className="flex-1 p-3">
        <h3 className="font-medium text-sm text-gray-900 mb-1">{name}</h3>
        <p className="text-red-500 font-medium text-sm mb-1.5">${price.toFixed(2)}</p>
        <p className="text-xs text-gray-600 line-clamp-2 mb-2">{description}</p>
        <a 
          href={`/products/${slug}`} 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition-colors"
        >
          View Product
        </a>
      </div>
    </div>
  );
}
