import { COLLECTIONS_SLUGS } from "@repo/shared";
import ProductCollectionSection from "../../features/products/components/ProductCollectionSection";
import femaleExercising from "@media/collections/femaleExercising.png";

const BestSellersSection = () => {
  return (
    <ProductCollectionSection
      collectionSlug={COLLECTIONS_SLUGS.BEST_SELLERS}
      groupImage={femaleExercising}
      wrapperClassName="bg-muted/30 dark:bg-muted/10"
    />
  );
};

export default BestSellersSection;
