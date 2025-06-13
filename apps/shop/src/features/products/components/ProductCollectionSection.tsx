"use client";

import { collectionService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import ProductSlider from "./ProductSlider";
import { ProductGroupType } from "@/src/features/products/types/productGroup";
import { SectionContainer } from "@repo/ui/components/SectionContainer";
import { StaticImageData } from "next/image";

interface ProductCollectionSectionProps {
  collectionSlug: string;
  groupImage: StaticImageData;
  className?: string;
  wrapperClassName?: string;
  productCount?: number;
}

const ProductCollectionSection = ({
  collectionSlug,
  groupImage,
  className,
  wrapperClassName,
  productCount = 4,
}: ProductCollectionSectionProps) => {
  const { data: collection, isLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(collectionSlug),
    serviceFn: () =>
      collectionService.getCollectionBySlug(collectionSlug, {
        currentPage: 1,
        itemsPerPage: productCount,
      }),
  });

  const content = (
    <ProductSlider
      groupType={ProductGroupType.Collections}
      productGroup={collection}
      groupImage={groupImage}
      isLoading={isLoading}
      productCount={productCount}
    />
  );

  return wrapperClassName ? (
    <div className={wrapperClassName}>
      <SectionContainer className={className}>{content}</SectionContainer>
    </div>
  ) : (
    <SectionContainer className={className}>{content}</SectionContainer>
  );
};

export default ProductCollectionSection;
