"use client";

import React from "react";
import { categoryService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { notFound, usePathname } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/components/ui/LoadingSpinner";

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
      <div className="layout flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!category) notFound();

  return <ProductGrid productGroup={category} isLoading={isLoading} />;
};

export default Page;
