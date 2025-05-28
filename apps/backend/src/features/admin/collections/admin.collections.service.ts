import { CollectionInput } from "@repo/shared";
import { slugifyNative } from "#utils/utils.js";
import adminCollectionsRepository from "./admin.collections.repository.js";
import { prepareCollectionUpdateData } from "./admin.collections.utils.js";

/**
 * Admin collections service responsible for collection management business logic
 */
export class AdminCollectionsService {
  /**
   * Add a new collection
   */
  async addCollection(data: CollectionInput) {
    // Create slug
    const slug = slugifyNative(data.name);

    const { products, ...collectionWithoutProducts } = data;

    await adminCollectionsRepository.createCollection({
      name: collectionWithoutProducts.name,
      description: data.description,
      parentId: collectionWithoutProducts.parentId,
      slug: slug,
      products: {
        connect: products?.map((product) => ({ id: product.id })),
      },
    });

    return { success: true, message: "Collection added successfully" };
  }

  /**
   * Update an existing collection
   */
  async updateCollection(
    collectionId: number,
    validatedCollectionInput: CollectionInput
  ) {
    const { products: collectionProducts, ...validatedCollection } =
      validatedCollectionInput;

    const originalCollection =
      await adminCollectionsRepository.findById(collectionId);

    if (!originalCollection) {
      throw new Error("Collection not found");
    }

    const dataToUpdate = prepareCollectionUpdateData(
      validatedCollection,
      originalCollection,
      collectionProducts
    );

    await adminCollectionsRepository.updateCollection(
      collectionId,
      dataToUpdate
    );

    return { success: true, message: "Collection updated successfully" };
  }

  /**
   * Delete a collection
   */
  async deleteCollection(collectionId: number) {
    const collection = await adminCollectionsRepository.findById(collectionId);

    if (!collection) {
      throw new Error("Collection not found");
    }

    if (collection.is_demo === true) {
      throw new Error(
        "This is a default demo collection and can't be deleted. Try adding your own and see how it works! 😉"
      );
    }

    await adminCollectionsRepository.deleteCollection(collectionId);

    return { success: true, message: "Collection deleted successfully" };
  }
}

export default new AdminCollectionsService();
