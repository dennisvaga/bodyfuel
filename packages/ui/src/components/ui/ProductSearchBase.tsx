"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "./input";
import { ProductWithImageUrl } from "@repo/database/types/product";
import { AppVariant } from "@repo/shared";
import { cn } from "#lib/utils";

export interface ProductSearchProps {
  onSearch: (query: string) => void;
  onSelect: (product: ProductWithImageUrl) => void;
  products: ProductWithImageUrl[];
  isLoading?: boolean;
  placeholder?: string;
  variant?: AppVariant;
  autoFocus?: boolean;
}

export const ProductSearchBase = ({
  onSearch,
  onSelect,
  products,
  isLoading,
  placeholder = "Search products...",
  variant = "shop",
  autoFocus = false,
}: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowResults(value.length > 0);
    onSearch(value);
  };

  const handleSelect = (product: ProductWithImageUrl) => {
    setSearchQuery(product.name);
    setShowResults(false);
    onSelect(product);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "w-full pr-10",
            variant === "admin"
              ? "border-border bg-popover"
              : "border-border bg-popover text-foreground"
          )}
        />
        <Search
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
            variant === "admin"
              ? "text-foreground/60 dark:text-gray-400"
              : "text-gray-400"
          }`}
        />
      </div>

      {showResults && (
        <div
          className={`scroll absolute mt-1 w-full rounded-md border shadow-lg z-10 ${
            variant === "admin"
              ? "border-border bg-popover dark:border-gray-700"
              : "border-gray-700 bg-popover"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2
                className={`h-4 w-4 animate-spin ${
                  variant === "admin"
                    ? "text-foreground/60 dark:text-gray-400"
                    : "text-gray-400"
                }`}
              />
            </div>
          ) : products.length === 0 ? (
            <div
              className={`py-6 text-center text-sm ${
                variant === "admin"
                  ? "text-foreground/60 dark:text-gray-400"
                  : "text-gray-400"
              }`}
            >
              No products found.
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto py-1">
              <div
                className={`px-2 py-1 text-xs ${
                  variant === "admin"
                    ? "text-foreground/60 dark:text-gray-400"
                    : "text-gray-400"
                }`}
              >
                Products
              </div>
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={`flex items-center gap-2 px-2 py-2 cursor-pointer ${
                    variant === "admin"
                      ? "hover:bg-accent dark:hover:bg-gray-800"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {product.images[0] && (
                    <img
                      src={product.images[0].imageUrl}
                      alt={product.name}
                      className="h-10 w-10 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex flex-col min-w-0">
                    <p
                      className={`font-medium truncate ${
                        variant === "admin"
                          ? "text-foreground dark:text-white"
                          : "text-white"
                      }`}
                    >
                      {product.name}
                    </p>
                    <p
                      className={`text-sm ${
                        variant === "admin"
                          ? "text-foreground/60 dark:text-gray-400"
                          : "text-gray-400"
                      }`}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
