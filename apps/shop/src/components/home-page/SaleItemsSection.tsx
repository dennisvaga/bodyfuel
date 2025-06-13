import { COLLECTIONS_SLUGS } from "@repo/shared";
import ProductCollectionSection from "../../features/products/components/ProductCollectionSection";
import manLiftingBarbell from "@media/collections/manLiftingBarbell.png";

const SaleItemsSection = () => {
  return (
    <ProductCollectionSection
      collectionSlug={COLLECTIONS_SLUGS.SALE_ITEMS}
      groupImage={manLiftingBarbell}
      className="bg-background"
    />
  );
};

export default SaleItemsSection;
