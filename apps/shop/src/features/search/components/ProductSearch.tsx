"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProductSearchBase } from "@repo/ui/components/features/products/ProductSearchBase";
import { productService, QUERY_KEYS } from "@repo/shared";
import { useState } from "react";
import { useDebounce } from "@repo/ui/hooks/useDebounce";

interface ProductSearchProps {
  onSearch?: () => void;
  autoFocus?: boolean;
  width?: string; // Add width prop
  className?: string;
}

export const ProductSearch = ({
  onSearch,
  autoFocus,
  width,
  className,
}: ProductSearchProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // * Only fetch products when user types (debounced)
  const { data: productsData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_SEARCH, debouncedSearch],
    queryFn: () => productService.searchProducts(debouncedSearch),
    enabled: !!debouncedSearch,
  });

  const products = productsData?.data ?? [];

  const handleSelect = (product: any) => {
    // Only close and navigate when a product is actually selected
    if (onSearch) {
      onSearch(); // Close the dialog
    }
    router.push(`/products/${product.slug}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Don't call onSearch here - we only want to close when user selects a product
    // or clicks outside the dialog, not during typing
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={width ? { width } : undefined}
      className={className}
    >
      <ProductSearchBase
        products={products}
        onSelect={handleSelect}
        onSearch={handleSearch}
        isLoading={isLoading}
        placeholder="Search products..."
        autoFocus={autoFocus}
      />
    </div>
  );
};
