"use client";

import ProductDetail from "@/src/features/products/components/ProductDetail";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
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

  return (
    <PageLayout isLoading={isLoading} data={product}>
      {(productData) => (
        <SectionContainer className="flex flex-row justify-center w-full">
          <ProductDetail product={productData} isLoading={false} />
        </SectionContainer>
      )}
    </PageLayout>
  );
};

export default page;
