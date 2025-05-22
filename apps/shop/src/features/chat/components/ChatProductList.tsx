"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { ChatProductCard, ChatProductCardProps } from "./ChatProductCard";

export interface ChatProductListProps {
  products: Omit<ChatProductCardProps, "className">[];
  className?: string;
}

// Using memo to prevent unnecessary re-renders
export const ChatProductList = memo(function ChatProductList({
  products,
  className,
}: ChatProductListProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <div
        className={cn(
          "flex flex-col space-y-1 rounded-md border border-border bg-card p-1 shadow-sm",
          className
        )}
      >
        {products.map((product, index) => (
          <ChatProductCard
            key={`product-${product.slug}-${index}`}
            {...product}
          />
        ))}
      </div>

      {/* Show a message indicating these are the top products */}
      {products.length > 0 && (
        <div className="text-xs text-muted-foreground text-start pt-1 pl-2">
          Here are the top {products.length} products matching your search
        </div>
      )}
    </div>
  );
});
