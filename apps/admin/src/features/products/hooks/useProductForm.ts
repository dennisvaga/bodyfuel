"use client";
import {
  ENTITY_TYPES,
  productFormSchema,
  ProductInput,
  productService,
  QUERY_KEYS,
} from "@repo/shared";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { ProductFormInput } from "@repo/shared";
import { collectionService } from "@repo/shared";
import { useFetchQuery } from "@repo/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEntitySubmit, useRelatedEntitySelection } from "@repo/shared";
import { useFormToast } from "@repo/ui/hooks/useFormToast";

/**
 * Transform Prisma data to match the form schema
 */
const transformProductForForm = (
  product: ProductWithImageUrl | undefined
): ProductFormInput => ({
  name: product?.name ?? "",
  description: product?.description ?? "",
  brand: product?.brand ?? "",
  categoryId: product?.categoryId ?? 1,
  price: product?.price ?? 0,
  quantity: product?.quantity ?? 0,
  images: [] as File[],
  collections: product?.collections?.map((collection) => ({
    ...collection,
    description: collection.description ?? "",
  })),
  options:
    // If its edit - Mark options as added
    product?.options?.map((option) => ({
      ...option,
      added: true,
    })) || [],
  // Needed to get the stock and price.
  variants: product?.variants ?? [],
});

export function useProductForm(product?: ProductWithImageUrl) {
  const { showSuccessToast, showErrorToast } = useFormToast();

  const { data: collections } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    serviceFn: collectionService.getCollections,
  });

  const { refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    serviceFn: productService.getProducts,
  });

  // Use shared utility for selection state
  const [rowSelection, setRowSelection] = useRelatedEntitySelection(
    product?.collections
  );

  const form = useForm<ProductInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: transformProductForForm(product),
  });

  // Use shared submission logic
  const { handleSubmit, fileInputRef } = useEntitySubmit({
    entityType: ENTITY_TYPES.PRODUCT,
    entityId: product?.id,
    addEntity: (data: ProductFormInput) => productService.addProduct(data),
    editEntity: (id, data) => productService.editProduct(id, data),
    onSuccess: (result, isEdit) => {
      if (!isEdit) {
        form.reset();
      }
      refetch();
    },
    showSuccessToast,
    showErrorToast,
  });

  async function onSubmit(productData: ProductFormInput) {
    const productDataWithCollections = {
      ...productData,
      collections: collections
        ?.filter((collection) => rowSelection[collection.id])
        .map((collection) => ({
          id: collection.id,
          name: collection.name,
        })),
    };

    await handleSubmit(productDataWithCollections);
  }

  return {
    form,
    formHeading: product ? "Edit Product" : "Add Product",
    rowSelection,
    setRowSelection,
    collections: collections,
    product,
    onSubmit,
    fileInputRef,
  };
}
