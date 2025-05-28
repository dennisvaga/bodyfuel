import { ProductWithImageUrl } from "@repo/database/types/product";
import { assignImageUrlToProducts } from "#services/s3Service.js";
import categoriesRepository from "./categories.repository.js";

/**
 * Categories service responsible for category-related business logic
 */
export class CategoriesService {
  /**
   * Get all categories
   */
  async getAllCategories() {
    const categories = await categoriesRepository.findAll();

    if (!categories) {
      throw new Error("No categories found");
    }

    return categories;
  }

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string) {
    const category = await categoriesRepository.findBySlug(slug);

    if (!category) {
      throw new Error("No category found");
    }

    // Add presigned URLs to product images
    category.products = await assignImageUrlToProducts(
      category.products as ProductWithImageUrl[]
    );

    return category;
  }
}

export default new CategoriesService();
