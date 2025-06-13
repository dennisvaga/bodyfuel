"use client";

import { useForm } from "react-hook-form";
import {
  collectionService,
  ENTITY_TYPES,
  productService,
  categoryService,
  QUERY_KEYS,
} from "@repo/shared";
import { useFetchQuery } from "@repo/shared";
import { CollectionInput, CollectionSchema } from "@repo/shared";
import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEntitySubmit, useRelatedEntitySelection } from "@repo/shared";
import { useFormToast } from "@repo/ui/hooks/useFormToast";

const transformCollectionForForm = (
  collection: CollectionWithProductsImageUrl | undefined
): Partial<CollectionInput> => ({
  name: collection?.name ?? "",
  description: collection?.description ?? "",
});

export function useCollectionForm(collection?: CollectionWithProductsImageUrl) {
  const { showSuccessToast, showErrorToast } = useFormToast();

  const formHeading = collection ? "Edit Collection" : "Add Collection";
  const { data: products } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    serviceFn: () => productService.getProducts({ getAllProducts: true }),
  });

  const { data: categories } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    serviceFn: () => categoryService.getCategoriesNames(),
  });

  const { refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    serviceFn: collectionService.getCollections,
  }); // Refresh products
  // Use shared utility for selection state
  const [rowSelection, setRowSelection] = useRelatedEntitySelection(
    collection?.products
  );

  // Initialize form
  const form = useForm<CollectionInput>({
    resolver: zodResolver(CollectionSchema),
    defaultValues: transformCollectionForForm(collection),
  });

  // Use shared submission logic
  const { handleSubmit } = useEntitySubmit({
    entityType: ENTITY_TYPES.COLLECTION,
    entityId: collection?.id,
    addEntity: (data: CollectionInput) => collectionService.addCollection(data),
    editEntity: (id, data) => collectionService.editCollection(id, data),
    onSuccess: (_, isEdit) => {
      if (!isEdit) {
        form.reset();
      }
      refetch();
    },
    showSuccessToast,
    showErrorToast,
  });

  const onSubmit = async (collectionData: CollectionInput) => {
    // Get selected products
    const collectionDataWithProductIds = {
      ...collectionData,
      products: Object.keys(rowSelection)
        .filter((productId) => rowSelection[productId])
        .map((productId) => ({ id: Number(productId) })),
    };

    await handleSubmit(collectionDataWithProductIds);
  };

  return {
    form,
    formHeading,
    products,
    categories,
    rowSelection,
    setRowSelection,
    onSubmit,
  };
}
