"use client";

import React from "react";
import { collectionService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { notFound, usePathname } from "next/navigation";
import { LoadingSpinner } from "@repo/ui/components/ui/LoadingSpinner";

const Page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: collection, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(slug ?? ""),
    serviceFn: () => collectionService.getCollectionBySlug(slug ?? ""),
  });

  if (isLoading)
    return (
      <div className="layout flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (!collection) notFound();

  return (
    <section className="layout">
      <ProductGrid productGroup={collection} isLoading={isLoading} />
    </section>
  );
};

export default Page;
