"use client";

import React from "react";
import { categoryService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { usePathname } from "next/navigation";
import PageLayout from "@/src/layouts/PageLayout";

const Page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: category, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORY(slug ?? ""),
    serviceFn: () => {
      return categoryService.getCategoryWithProducts(slug ?? "");
    },
  });

  return (
    <PageLayout data={category} isLoading={isLoading} className="pb-48">
      {(categoryData, loading) => (
        <ProductGrid productGroup={categoryData} isLoading={loading} />
      )}
    </PageLayout>
  );
};

export default Page;
