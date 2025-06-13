"use client";

import React from "react";
import { collectionService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductGrid from "@/src/features/products/components/ProductGrid";
import { notFound, usePathname } from "next/navigation";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const Page = () => {
  const pathname = usePathname();
  const slug = pathname.split("/").pop();

  const { data: collection, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(slug ?? ""),
    serviceFn: () => collectionService.getCollectionBySlug(slug ?? ""),
  });

  if (isLoading)
    return (
      <SectionContainer className="flex justify-center">
        <LoadAnimation />
      </SectionContainer>
    );
  if (!collection) notFound();

  return (
    <SectionContainer>
      <ProductGrid productGroup={collection} isLoading={isLoading} />
    </SectionContainer>
  );
};

export default Page;
