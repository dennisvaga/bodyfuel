"use client";

import {
  COLLECTIONS_SLUGS,
  collectionService,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import ProductSlider from "../../features/products/components/ProductSlider";
import { ProductGroupType } from "@/src/features/products/types/productGroup";
import manLiftingBarbell from "@media/collections/manLiftingBarbell.png";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

const NewArrivalsSection = () => {
  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(COLLECTIONS_SLUGS.NEW_ARRIVALS),
    serviceFn: () =>
      collectionService.getCollectionBySlug(COLLECTIONS_SLUGS.NEW_ARRIVALS, {
        currentPage: 1,
        itemsPerPage: 4,
      }),
  });

  return (
    <SectionContainer className="bg-background">
      <ProductSlider
        groupType={ProductGroupType.Collections}
        productGroup={newArrivals}
        groupImage={manLiftingBarbell}
        isLoading={isNewArrivalsLoading}
        productCount={4}
      />
    </SectionContainer>
  );
};

export default NewArrivalsSection;
