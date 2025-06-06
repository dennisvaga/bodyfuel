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

const SaleItemsSection = () => {
  const { data: saleItems, isLoading: isSaleItemsLoading } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTION(COLLECTIONS_SLUGS.SALE_ITEMS),
    serviceFn: () =>
      collectionService.getCollectionBySlug(COLLECTIONS_SLUGS.SALE_ITEMS, {
        currentPage: 1,
        itemsPerPage: 5,
      }),
  });

  return (
    <SectionContainer className="bg-background">
      <ProductSlider
        groupType={ProductGroupType.Collections}
        productGroup={saleItems}
        groupImage={manLiftingBarbell}
        isLoading={isSaleItemsLoading}
        productCount={5}
      />
    </SectionContainer>
  );
};

export default SaleItemsSection;
