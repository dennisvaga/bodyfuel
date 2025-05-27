import { CollectionWithProducts } from "@repo/database/types/collection";
import { CollectionInput, CollectionInputField } from "@repo/shared";

export function prepareCollectionUpdateData(
  validatedCollection: Partial<CollectionInput>,
  originalCollection: CollectionWithProducts,
  collectionProducts:
    | {
        id: number;
      }[]
    | undefined
) {
  const dataToUpdate: any = {};

  // Name and description
  const fields = [
    CollectionInputField.NAME,
    CollectionInputField.DESCRIPTION,
  ] as const; // Scalar fields only

  fields.forEach((field) => {
    // Ensure data is not undefined and its different from original data.
    if (
      validatedCollection[field] !== undefined &&
      validatedCollection[field] !== originalCollection[field]
    ) {
      dataToUpdate[field] = validatedCollection[field];
    }
  });

  // Products
  if (collectionProducts) {
    const originalProductIds = originalCollection.products.map((p) => p.id);

    // Calculate products to connect (newly added products)
    const productsToConnect = collectionProducts.filter(
      (product) => !originalProductIds.includes(product.id)
    );

    // Calculate products to disconnect (removed products)
    const productsToDisconnect = originalProductIds.filter(
      (id) => !collectionProducts.some((product) => product.id === id)
    );

    // Correctly format `connect` and `disconnect` data
    dataToUpdate.products = {
      connect: productsToConnect.map((product) => ({ id: product.id })),
      disconnect: productsToDisconnect.map((id) => ({ id })),
    };
  }

  return dataToUpdate;
}
