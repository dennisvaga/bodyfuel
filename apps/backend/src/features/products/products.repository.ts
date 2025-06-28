import { PrismaClient } from "@prisma/client";
import { ProductOptionInput, ProductVariantInput } from "@repo/shared";
import { getPrisma } from "@repo/database";
import {
  PRODUCT_BASIC_INCLUDE,
  PRODUCT_FULL_INCLUDE,
} from "@repo/database/includes/product-includes";

type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
type TempIdMapping = Record<string, number>;

/**
 * Product repository responsible for all database operations related to products
 */
export class ProductRepository {
  static createProductVariants(
    tx: any,
    id: any,
    variants: {
      id: string | number;
      price: number;
      stock: number;
      variantOptionValues?:
        | {
            optionValueId: string | number;
            optionValue: {
              id?: string | number | undefined; // Create VariantOptionValue // Create VariantOptionValue
              value?: string | undefined;
            };
          }[]
        | undefined;
    }[],
    tempOptValueIdToRealId: Record<string, number>
  ) {
    throw new Error("Method not implemented.");
  }
  /**
   * Find all products
   */
  async findAll() {
    const prisma = await getPrisma();
    return prisma.product.findMany({
      include: PRODUCT_BASIC_INCLUDE,
    });
  }

  /**
   * Find products with pagination
   */
  async findAllPaginated(skip: number, take: number) {
    const prisma = await getPrisma();
    return prisma.$transaction([
      // Query 1: Get total count of products
      prisma.product.count(),

      // Query 2: Fetch products with their associated images
      prisma.product.findMany({
        skip,
        take,
        include: PRODUCT_BASIC_INCLUDE,
      }),
    ]);
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string) {
    const prisma = await getPrisma();
    return prisma.product.findMany({
      where: { slug },
      include: PRODUCT_FULL_INCLUDE,
    });
  }

  /**
   * Search products
   */
  async search(searchTerm?: string, limit: number = 100) {
    const prisma = await getPrisma();
    return prisma.product.findMany({
      where: searchTerm
        ? {
            name: { contains: searchTerm, mode: "insensitive" },
          }
        : undefined,
      include: PRODUCT_BASIC_INCLUDE,
      take: limit,
    });
  }

  /**
   * Create product options and their values
   */
  async createProductOptions(
    tx: PrismaTransaction,
    productId: number,
    options: ProductOptionInput[],
    tempOptValueIdToRealId: TempIdMapping
  ) {
    for (const option of options) {
      // Create the ProductOption
      const createdOption = await tx.productOption.create({
        data: {
          productId: productId,
          name: option.name,
        },
      });

      // Now create the nested ProductOptionValues
      if (option.optionValues.length) {
        for (const optVal of option.optionValues) {
          const createdValue = await tx.productOptionValue.create({
            data: {
              optionId: createdOption.id,
              value: optVal.value,
            },
          });
          // Map frontend temp uuid to realId
          tempOptValueIdToRealId[optVal.id] = createdValue.id;
        }
      }
    }
  }

  /**
   * Create product variants and their option values
   */
  async createProductVariants(
    tx: PrismaTransaction,
    productId: number,
    variants: ProductVariantInput[],
    tempOptValueIdToRealId: TempIdMapping
  ) {
    for (const variant of variants) {
      // Create the ProductVariant
      const createdVariant = await tx.productVariant.create({
        data: {
          productId: productId,
          price: variant.price,
          stock: variant.stock,
        },
      });

      // For each variantOptionValue, connect to the correct OptionValue
      if (variant.variantOptionValues?.length) {
        for (const vOptVal of variant.variantOptionValues) {
          // 1) We take the "temporary" ID from the frontend (e.g. "temp-val-red")
          // 2) We find the real DB ID from the dictionary we built above
          const realValueId = tempOptValueIdToRealId[vOptVal.optionValueId];
          if (!realValueId) {
            throw new Error(
              `Cannot find real OptionValue ID for temp ID: ${vOptVal.optionValueId}`
            );
          }
          // Create the linking record
          await tx.productVariantOptionValue.create({
            data: {
              variantId: createdVariant.id,
              optionValueId: realValueId,
            },
          });
        }
      }
    }
  }

  /**
   * Update product options and their values
   */
  async updateProductOptions(
    tx: PrismaTransaction,
    productId: number,
    options: ProductOptionInput[],
    tempOptValToRealId: TempIdMapping
  ) {
    // If empty options array provided, delete all options intentionally
    if (options.length === 0) {
      await tx.productOption.deleteMany({ where: { productId } });
      return;
    }

    // If user removed some of the options, remove them
    await this.deleteUnusedOptions(tx, productId, options);

    // Update or create options
    for (const dataOpt of options) {
      const createdOption = await tx.productOption.upsert({
        where: {
          productId_name: {
            productId: productId,
            name: dataOpt.name,
          },
        },
        update: {}, // If where condition is met, don't make any changes.
        create: {
          productId: productId,
          name: dataOpt.name,
        },
      });

      // Get `option values` in the incoming array
      const incomingValues = dataOpt.optionValues.map((ov) => ov.value);

      // Delete option values that are no longer needed
      await tx.productOptionValue.deleteMany({
        where: {
          optionId: createdOption.id,
          value: { notIn: incomingValues },
        },
      });

      // Option values - create or update
      for (const dataOv of dataOpt.optionValues) {
        const createdValue = await tx.productOptionValue.upsert({
          where: {
            optionId_value: {
              optionId: createdOption.id,
              value: dataOv.value,
            },
          },
          update: {},
          create: {
            optionId: createdOption.id,
            value: dataOv.value,
          },
        });

        // Map frontend temp uuid to realId
        tempOptValToRealId[dataOv.id] = createdValue.id;
      }
    }
  }

  /**
   * Delete unused options
   */
  async deleteUnusedOptions(
    tx: PrismaTransaction,
    productId: number,
    options: ProductOptionInput[]
  ) {
    const existingOptions = await tx.productOption.findMany({
      where: { productId },
    });

    // Get the names of options in the incoming array
    const incomingOptionNames = options.map((opt) => opt.name);

    // Find options that need to be deleted (exist in DB but not in incoming array)
    const optionsToDelete = existingOptions.filter(
      (existingOpt) => !incomingOptionNames.includes(existingOpt.name)
    );

    // Delete options that are no longer needed
    if (optionsToDelete.length > 0) {
      await tx.productOption.deleteMany({
        where: {
          id: { in: optionsToDelete.map((opt) => opt.id) },
        },
      });
    }
  }

  /**
   * Updates product variants for a given product
   */
  async updateProductVariants(
    tx: PrismaTransaction,
    productId: number,
    variants: ProductVariantInput[],
    tempOptValToRealId: TempIdMapping
  ) {
    // Always delete existing variants
    await tx.productVariant.deleteMany({
      where: { productId },
    });

    // If no new variants to create, we're done
    if (variants.length === 0) return;

    // Create new variants
    for (const dataVrnt of variants) {
      // Create variant
      const createdVariant = await tx.productVariant.create({
        data: {
          productId: productId,
          price: dataVrnt.price,
          stock: dataVrnt.stock,
        },
      });

      // Create VariantOptionValue
      for (const dataOptVal of dataVrnt.variantOptionValues ?? []) {
        const realId = tempOptValToRealId[dataOptVal.optionValueId];

        if (!realId) {
          throw new Error(
            `Cannot find real OptionValue ID for temp ID: ${dataOptVal.optionValueId}`
          );
        }

        await tx.productVariantOptionValue.create({
          data: {
            variantId: createdVariant.id,
            optionValueId: realId,
          },
        });
      }
    }
  }
}

export default new ProductRepository();
