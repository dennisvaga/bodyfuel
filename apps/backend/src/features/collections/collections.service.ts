import { ProductWithImageUrl } from "@repo/database/types/product";
import { PaginationMetadata } from "@repo/shared";
import { assignImageUrlToProducts } from "#services/s3Service.js";
import { getPaginationMetaData } from "#utils/pagination-utils.js";
import collectionsRepository from "./collections.repository.js";

/**
 * Collections service responsible for collection-related business logic
 */
export class CollectionsService {
  /**
   * Get all collections with optional pagination and product inclusion
   */
  async getAllCollections(
    includeProducts: boolean = false,
    usePagination: boolean = false,
    currentPage: number = 1,
    itemsPerPage: number = 10
  ) {
    if (usePagination) {
      const skip = (currentPage - 1) * itemsPerPage;
      const totalCount = await collectionsRepository.count();

      const collections = await collectionsRepository.findAll(
        includeProducts,
        skip,
        itemsPerPage
      );

      if (!collections.length) {
        throw new Error("No collections found");
      }

      return {
        collections,
        pagination: getPaginationMetaData(
          currentPage,
          totalCount,
          itemsPerPage
        ),
      };
    }

    const collections = await collectionsRepository.findAll(includeProducts);

    if (!collections.length) {
      throw new Error("No collections found");
    }

    return { collections };
  }

  /**
   * Get collection by slug with paginated products
   */
  async getCollectionBySlugWithPaginatedProducts(
    slug: string,
    currentPage: number,
    itemsPerPage: number
  ): Promise<{
    collection: any;
    pagination: PaginationMetadata;
  }> {
    const skip = (currentPage - 1) * itemsPerPage;

    const [totalCount, collectionWithProducts] =
      await collectionsRepository.findBySlugWithPaginatedProducts(
        slug,
        skip,
        itemsPerPage
      );

    if (!collectionWithProducts) {
      throw new Error("No collection found");
    }

    // Assign image URLs to products
    collectionWithProducts.products = await assignImageUrlToProducts(
      collectionWithProducts.products as ProductWithImageUrl[]
    );

    // Create pagination metadata
    const pagination = getPaginationMetaData(
      currentPage,
      totalCount,
      itemsPerPage
    );

    return {
      collection: collectionWithProducts,
      pagination,
    };
  }
}

export default new CollectionsService();
