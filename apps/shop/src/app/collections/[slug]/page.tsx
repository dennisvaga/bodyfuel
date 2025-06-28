"use client";

import React from "react";
import { collectionService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { usePathname } from "next/navigation";
import PageLayout from "@/src/layouts/PageLayout";

const Page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: collection, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(slug ?? ""),
    serviceFn: () => collectionService.getCollectionBySlug(slug ?? ""),
  });

  return (
    <PageLayout data={collection} isLoading={isLoading} className="pb-48">
      {(collectionData, loading) => (
        <ProductGrid productGroup={collectionData} isLoading={loading} />
      )}
    </PageLayout>
  );
};

export default Page;
