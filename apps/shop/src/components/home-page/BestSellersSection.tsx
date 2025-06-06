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
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const BestSellersSection = () => {
  const { data: bestSellers, isLoading: isBestSellersLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(COLLECTIONS_SLUGS.BEST_SELLERS),
    serviceFn: () =>
      collectionService.getCollectionBySlug(COLLECTIONS_SLUGS.BEST_SELLERS, {
        currentPage: 1,
        itemsPerPage: 4,
      }),
  });

  return (
    <div className="bg-muted/30 dark:bg-muted/10">
      <SectionContainer>
        <ProductSlider
          groupType={ProductGroupType.Collections}
          productGroup={bestSellers}
          groupImage={femaleExercising}
          isLoading={isBestSellersLoading}
          productCount={4}
        />
      </SectionContainer>
    </div>
  );
};

export default BestSellersSection;
