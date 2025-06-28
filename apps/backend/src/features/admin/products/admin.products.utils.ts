import { ProductInput, ProductInputField } from "@repo/shared";
import { uploadImages } from "#services/s3Service.js";

/**
 * Upload product images
 *
 * @returns Array of image keys
 */
export async function uploadProductImages(images: Express.Multer.File[]) {
  let imageKeys: string[] = [];
  if (images.length > 0) {
    imageKeys = await uploadImages(images);
  }
  return imageKeys;
}

/**
 * Prepares product data for creation
 *
 * @param validatedData Validated product input
 * @param slug Product slug
 * @param imageKeys Array of image keys
 * @returns Product data for creation
 */
export function prepareProductCreateData(
  validatedData: ProductInput,
  slug: string,
  imageKeys: string[]
) {
  return {
    name: validatedData.name,
    categoryId: validatedData.categoryId,
    price: validatedData.price,
    quantity: validatedData.quantity,
    description: validatedData.description,
    brand: validatedData.brand,
    slug,
    images: {
      create: imageKeys.map((key) => ({ imageKey: key })),
    },
    collections: validatedData.collections?.length
      ? {
          connect: validatedData.collections.map((collection) => ({
            id: Number(collection.id),
          })),
        }
      : undefined,
  };
}

/**
 * Prepare product data for update
 *
 * @param validatedData Validated product input
 * @param originalProduct Original product data
 * @param imageKeys Array of image keys (optional)
 * @returns Product update data
 */
export function prepareProductUpdateData(
  validatedData: ProductInput,
  originalProduct: any,
  imageKeys: string[] = []
) {
  // Construct product data to update
  const dataToUpdate: any = {};

  // -----------------------------------------
  // Data without relations
  // -----------------------------------------
  const fields = [
    ProductInputField.NAME,
    ProductInputField.DESCRIPTION,
    ProductInputField.BRAND,
    ProductInputField.PRICE,
    ProductInputField.QUANTITY,
  ] as const;

  fields.forEach((field) => {
    // Ensure data is not undefined and its different from original data.
    if (
      validatedData[field] !== undefined &&
      validatedData[field] !== originalProduct[field]
    ) {
      dataToUpdate[field] = validatedData[field];
    }
  });

  // -----------------------------------------
  // Data with relations
  // -----------------------------------------
  // Images
  if (imageKeys?.length > 0) {
    dataToUpdate.images = {
      // First erase all previous images
      set: [],
      // Then create new ones
      create: imageKeys.map((key) => ({ imageKey: key })),
    };
  }

  // Category
  if (
    validatedData.categoryId &&
    validatedData.categoryId !== originalProduct.categoryId
  ) {
    dataToUpdate.category = { connect: { id: validatedData.categoryId } };
  }

  // Collections
  if (validatedData.collections?.length) {
    dataToUpdate.collections = {
      // First erase all previous collections
      set: [],
      // Then create new ones
      connect: validatedData.collections.map((collection) => ({
        id: collection.id,
      })),
    };
  }

  return dataToUpdate;
}
