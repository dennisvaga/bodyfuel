"use client";

import ProductDetail from "@/src/features/products/components/ProductDetail";
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
      <div className="layout">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="layout">
      <div className="flex flex-row justify-center w-full">
        <ProductDetail product={product} isLoading={isLoading}></ProductDetail>
      </div>
    </div>
  );
};

export default page;
