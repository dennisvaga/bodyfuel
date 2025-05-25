import { getPrisma } from "@repo/database";
import express, { Request, Response, Router } from "express";
import { handleError } from "../../utils/handleErrors.js";
import { slugifyNative } from "../../utils/utils.js";
import { CollectionInput, CollectionSchema } from "@repo/shared";
import { validateData } from "@repo/shared";
import { sendResponse } from "../../utils/apiResponse.js";
import { CollectionWithProducts } from "@repo/database/types/collection";
import { prepareCollectionUpdateData } from "../../services/collectionService.js";

const router: Router = express.Router();

// Add collection
router.post("/", async (req: Request, res: Response) => {
  try {
    const prisma = await getPrisma();

    // const collectionData = JSON.parse(req.body);
    const collectionData = req.body;
    const data: CollectionInput = validateData(
      CollectionSchema,
      collectionData
    );

    // Create slug
    const slug = slugifyNative(data.name);

    const { products, ...collectionWithoutProducts } = data;

    await prisma.collection.create({
      data: {
        name: collectionWithoutProducts.name,
        description: collectionData.description,
        parentId: collectionWithoutProducts.parentId,
        slug: slug,
        products: {
          connect: products?.map((product) => ({ id: product.id })),
        },
      },
    });

    sendResponse(res, 201, {
      success: true,
      message: "Collection added successfully",
    });
  } catch (error) {
    handleError(error, res, true);
  }
});

// Edit collection
router.put("/:id", async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  const collectionId = parseInt(id);

  try {
    const prisma = await getPrisma();
    // const rawCollectionInput = JSON.parse(req.body);
    const rawCollectionInput = req.body;
    const validatedCollectionInput: CollectionInput = validateData(
      CollectionSchema,
      rawCollectionInput
    );

    const { products: collectionProducts, ...validatedCollection } =
      validatedCollectionInput;

    const originalCollection: CollectionWithProducts | null =
      await prisma.collection.findUnique({
        where: { id: collectionId },
        include: { products: true },
      });

    if (!originalCollection) {
      sendResponse(res, 404, {
        success: false,
        message: "Collection not found",
      });
      return;
    }

    const dataToUpdate: any = prepareCollectionUpdateData(
      validatedCollection,
      originalCollection,
      collectionProducts
    );

    await prisma.collection.update({
      where: { id: collectionId },
      data: dataToUpdate,
    });

    sendResponse(res, 201, {
      success: true,
      message: "Collection updated successfully",
    });
  } catch (error) {
    handleError(error, res, true);
  }
});

// Delete collection
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const prisma = await getPrisma();
    const { id } = req.params;
    const collectionId = parseInt(id);

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      sendResponse(res, 404, {
        success: false,
        message: "Collection not found",
      });
      return;
    }

    if (collection.is_demo === true) {
      sendResponse(res, 403, {
        success: false,
        message:
          "This is a default demo collection and can't be deleted. Try adding your own and see how it works! 😉",
      });
      return;
    }

    await prisma.collection.delete({ where: { id: collectionId } });

    sendResponse(res, 200, {
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    handleError(error, res, true);
  }
});

export default router;
