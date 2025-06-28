"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProductSearchBase } from "@repo/ui/components/features/products/ProductSearchBase";
import { productService, QUERY_KEYS } from "@repo/shared";
import { useState } from "react";
import { useDebounce } from "@repo/ui/hooks/useDebounce";

export const ProductSearch = () => {
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
    router.push(`/products/${product.slug}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ProductSearchBase
      products={products}
      onSelect={handleSelect}
      onSearch={handleSearch}
      isLoading={isLoading}
      placeholder="Search products..."
    />
  );
};
