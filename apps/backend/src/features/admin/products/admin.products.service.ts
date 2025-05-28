import { ProductInput } from "@repo/shared";
import { slugifyNative } from "#utils/utils.js";
import adminProductsRepository from "./admin.products.repository.js";
import {
  uploadProductImages,
  prepareProductCreateData,
  prepareProductUpdateData,
} from "./admin.products.utils.js";
import productsRepository from "#features/products/products.repository.js";

/**
 * Admin products service responsible for product management business logic
 */
export class AdminProductsService {
  /**
   * Add a new product
   */
  async addProduct(validatedData: ProductInput, images: Express.Multer.File[]) {
    // Upload images to S3 (if any exist)
    const imageKeys = await uploadProductImages(images);

    const slug = slugifyNative(validatedData.name);

    // Store mappings from the frontend "temp" ID to the actual DB ID.
    const tempOptValueIdToRealId: Record<string, number> = {};

    // Use a transaction for creating the product and related entities
    await adminProductsRepository.executeTransaction(async (tx) => {
      // Create the product
      const productData = prepareProductCreateData(
        validatedData,
        slug,
        imageKeys
      );
      const createdProduct = await tx.product.create({ data: productData });

      // Create product options + option values
      if (validatedData.options?.length) {
        await productsRepository.createProductOptions(
          tx,
          createdProduct.id,
          validatedData.options,
          tempOptValueIdToRealId
        );
      }

      // Create product variants + variant option values
      if (validatedData.variants?.length) {
        await productsRepository.createProductVariants(
          tx,
          createdProduct.id,
          validatedData.variants,
          tempOptValueIdToRealId
        );
      }
    });

    return { success: true, message: "Product added successfully" };
  }

  /**
   * Update an existing product
   */
  async updateProduct(
    productId: number,
    validatedData: ProductInput,
    images: Express.Multer.File[]
  ) {
    // Get the original product
    const originalProduct = await adminProductsRepository.findById(productId);

    if (!originalProduct) {
      throw new Error("Product not found");
    }

    // Upload new images if provided
    const imageKeys = await uploadProductImages(images);

    // Use a transaction for updating the product and related entities
    await adminProductsRepository.executeTransaction(async (tx) => {
      // Prepare update data
      const dataToUpdate = prepareProductUpdateData(
        validatedData,
        originalProduct,
        imageKeys
      );

      // If we have new images, delete the old ones first
      if (imageKeys?.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId },
        });
      }

      // Update product
      await tx.product.update({
        where: { id: productId },
        data: dataToUpdate,
      });

      // For `VariantOptionValue` usage
      const tempOptValToRealId: Record<string, number> = {};

      // Update options
      await productsRepository.updateProductOptions(
        tx,
        productId,
        validatedData.options ?? [],
        tempOptValToRealId
      );

      // Update variants + VariantOptionValue
      await productsRepository.updateProductVariants(
        tx,
        productId,
        validatedData.variants ?? [],
        tempOptValToRealId
      );
    });

    return { success: true, message: "Product updated successfully" };
  }

  /**
   * Delete a product
   */
  async deleteProduct(productId: number) {
    const product = await adminProductsRepository.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.is_demo === true) {
      throw new Error(
        "This is a default demo product and can't be deleted. Try adding your own and see how it works! 😉"
      );
    }

    await adminProductsRepository.deleteProduct(productId);

    return { success: true, message: "Product deleted successfully" };
  }
}

export default new AdminProductsService();
