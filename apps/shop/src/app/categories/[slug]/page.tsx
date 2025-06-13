"use client";

import React from "react";
import { categoryService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { usePathname } from "next/navigation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
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
    <PageLayout isLoading={isLoading} data={category}>
      {(category) => (
        <SectionContainer>
          <ProductGrid productGroup={category} isLoading={false} />
        </SectionContainer>
      )}
    </PageLayout>
  );
};

export default Page;
