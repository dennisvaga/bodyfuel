"use client";

import ProductDetail from "@/src/features/products/components/ProductDetail";
import { SectionContainer } from "@/src/layouts/SectionContainer";
import { useFetchQuery, QUERY_KEYS, productService } from "@repo/shared";
import { notFound, usePathname } from "next/navigation";
import React from "react";

const page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: product, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCT_BY_SLUG(slug ?? ""),
    serviceFn: () => productService.getProductBySlug(slug ?? ""),
  });

  if (isLoading) {
    return (
      <SectionContainer>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>Loading product...</p>
        </div>
      </SectionContainer>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <SectionContainer className="flex flex-row justify-center w-full">
      <ProductDetail product={product} isLoading={isLoading}></ProductDetail>
    </SectionContainer>
  );
};

export default page;
