"use client";

import React from "react";
import { productService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import PageLayout from "@/src/layouts/PageLayout";

const ProductsPage = () => {
  const { data: productsData, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    serviceFn: () => productService.getProducts({ getAllProducts: true }),
  });

  return (
    <PageLayout
      data={productsData}
      isLoading={isLoading}
      requiresEntity={false}
    >
      {(products, loading) => (
        <ProductGrid productGroup={products} isLoading={loading} />
      )}
    </PageLayout>
  );
};

export default ProductsPage;
