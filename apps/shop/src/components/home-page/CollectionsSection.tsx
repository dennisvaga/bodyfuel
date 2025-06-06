"use client";

import {
  COLLECTIONS_SLUGS,
  collectionService,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import ProductSlider from "../../features/products/components/ProductSlider";
import { ProductGroupType } from "@/src/features/products/types/productGroup";
import femaleExercising from "@media/collections/femaleExercising.png";
import manLiftingBarbell from "@media/collections/manLiftingBarbell.png";
import { SectionContainer } from "@/src/layouts/SectionContainer";

const CollectionsSection = () => {
  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(COLLECTIONS_SLUGS.NEW_ARRIVALS),
    serviceFn: () =>
      collectionService.getCollectionBySlug(COLLECTIONS_SLUGS.NEW_ARRIVALS, {
        currentPage: 1,
        itemsPerPage: 4,
      }),
  });

  const { data: bestSellers, isLoading: isBestSellersLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(COLLECTIONS_SLUGS.BEST_SELLERS),
    serviceFn: () =>
      collectionService.getCollectionBySlug(COLLECTIONS_SLUGS.BEST_SELLERS, {
        currentPage: 1,
        itemsPerPage: 4,
      }),
  });

  return (
    <SectionContainer className="flex flex-col gap-12 md:gap-20 bg-background">
      <ProductSlider
        groupType={ProductGroupType.Collections}
        productGroup={newArrivals}
        groupImage={manLiftingBarbell}
        isLoading={isNewArrivalsLoading}
        productCount={4}
      />

      <ProductSlider
        groupType={ProductGroupType.Collections}
        productGroup={bestSellers}
        groupImage={femaleExercising}
        isLoading={isBestSellersLoading}
        productCount={4}
      />
    </SectionContainer>
  );
};

export default CollectionsSection;
