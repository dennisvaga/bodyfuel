"use client";

import React from "react";
import { productService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { notFound } from "next/navigation";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const ProductsPage = () => {
  const { data: productsData, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    serviceFn: () => productService.getProducts({ getAllProducts: true }),
  });

  if (isLoading)
    return (
      <SectionContainer className="flex justify-center">
        <LoadAnimation />
      </SectionContainer>
    );
  if (!productsData) notFound();

  return (
    <SectionContainer>
      <ProductGrid productGroup={productsData} isLoading={isLoading} />
    </SectionContainer>
  );
};

export default ProductsPage;
