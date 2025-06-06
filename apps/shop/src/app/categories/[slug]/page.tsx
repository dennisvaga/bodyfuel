"use client";

import React from "react";
import { categoryService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { notFound, usePathname } from "next/navigation";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const Page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: category, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORY(slug ?? ""),
    serviceFn: () => {
      console.log("Calling serviceFn with slug:", slug); // Debug line
      return categoryService.getCategoryWithProducts(slug ?? "");
    },
  });

  if (isLoading)
    return (
      <SectionContainer className="flex justify-center">
        <LoadAnimation />
      </SectionContainer>
    );
  if (!category) notFound();

  return (
    <SectionContainer>
      <ProductGrid productGroup={category} isLoading={isLoading} />;
    </SectionContainer>
  );
};

export default Page;
