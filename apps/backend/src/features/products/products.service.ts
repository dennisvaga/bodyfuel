import type { ProductWithImageUrl } from "@repo/database/types/product";
import { assignImageUrlToProducts } from "#services/s3Service.js";
import productRepository from "./products.repository.js";
import { PaginationMetadata } from "@repo/shared";

/**
 * Product service responsible for product-related business logic
 */
export class ProductService {
  /**
   * Get all products
   */
  async getAllProducts(): Promise<ProductWithImageUrl[]> {
    const products = await productRepository.findAll();

    if (products.length === 0) {
      return [];
    }

    return assignImageUrlToProducts(products as ProductWithImageUrl[]);
  }

  /**
   * Get products with pagination
   */
  async getPaginatedProducts(
    currentPage: number,
    itemsPerPage: number
  ): Promise<{
    products: ProductWithImageUrl[];
    pagination: PaginationMetadata;
  }> {
    const skip = (currentPage - 1) * itemsPerPage;
    const [totalItems, products] = await productRepository.findAllPaginated(
      skip,
      itemsPerPage
    );

    const productsWithPresignedUrls =
      products.length > 0
        ? await assignImageUrlToProducts(products as ProductWithImageUrl[])
        : [];

    const paginationData = this.getPaginationMetaData(
      currentPage,
      totalItems,
      itemsPerPage
    );

    return {
      products: productsWithPresignedUrls,
      pagination: paginationData,
    };
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<ProductWithImageUrl> {
    const products = await productRepository.findBySlug(slug);

    if (products.length === 0) {
      throw new Error("No products found");
    }

    const productsWithPresignedUrls = await assignImageUrlToProducts(
      products as unknown as ProductWithImageUrl[]
    );

    return productsWithPresignedUrls[0];
  }

  /**
   * Search products
   */
  async searchProducts(search?: string): Promise<ProductWithImageUrl[]> {
    const products = await productRepository.search(search);

    if (products.length === 0) {
      return [];
    }

    return assignImageUrlToProducts(products as ProductWithImageUrl[]);
  }

  /**
   * Generate pagination metadata
   */
  private getPaginationMetaData(
    currentPage: number,
    totalItems: number,
    itemsPerPage: number
  ): PaginationMetadata {
    return {
      currentPage,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      totalItems,
      itemsPerPage,
    };
  }
}

export default new ProductService();
