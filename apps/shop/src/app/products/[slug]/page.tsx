"use client";

import ProductDetail from "@/src/features/products/components/ProductDetail";
import { useFetchQuery, QUERY_KEYS, productService } from "@repo/shared";
import { usePathname } from "next/navigation";
import React from "react";
import PageLayout from "@/src/layouts/PageLayout";

const page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: product, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCT_BY_SLUG(slug ?? ""),
    serviceFn: () => productService.getProductBySlug(slug ?? ""),
  });

  // Always render ProductDetail - it handles its own loading/skeleton states
  return (
    <PageLayout
      data={product}
      isLoading={isLoading}
      containerClassName="flex flex-row justify-center w-full"
    >
      {() => <ProductDetail product={product} isLoading={isLoading} />}
    </PageLayout>
  );
};

export default page;
