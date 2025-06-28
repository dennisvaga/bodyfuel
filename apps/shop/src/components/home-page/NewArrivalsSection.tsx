import { COLLECTIONS_SLUGS } from "@repo/shared";
import ProductCollectionSection from "../../features/products/components/ProductCollectionSection";
import manLiftingBarbell from "@media/collections/manLiftingBarbell.png";

const NewArrivalsSection = () => {
  return (
    <ProductCollectionSection
      collectionSlug={COLLECTIONS_SLUGS.NEW_ARRIVALS}
      groupImage={manLiftingBarbell}
      className="bg-background"
    />
  );
};

export default NewArrivalsSection;
