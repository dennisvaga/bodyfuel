import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { CartWithItems } from "@repo/database/types/cart";
import type { ProductWithImageUrl } from "@repo/database/types/product";

let s3Client: S3Client | null = null;

// Configure S3 client
export const getS3Client = (): S3Client => {
  if (!s3Client) {
    // Initialize the S3 client lazily
    s3Client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }
  return s3Client;
};

export async function uploadImages(images: Express.Multer.File[]) {
  const uploadPromises = images.map(async (image) => {
    const key = `products/${Date.now()}--${image.originalname}`;

    // Upload image to S3
    await uploadFileToS3({
      bucketName: process.env.AWS_S3_BUCKET_NAME!,
      key: key,
      buffer: image.buffer,
    });

    return key;
  });

  return Promise.all(uploadPromises);
}

export function assignImageUrlToProducts(products: ProductWithImageUrl[]) {
  // Map over products to get public URL for each image
  return products.map((product) => ({
    ...product,
    images: product.images.map((image) => ({
      ...image,
      imageUrl: getPublicUrl({
        bucketName: process.env.AWS_S3_BUCKET_NAME!,
        objectKey: image.imageKey.replace(
          `${process.env.AWS_BUCKET_ENDPOINT_URL!}/`,
          ""
        ),
      }),
    })),
  }));
}

export function assignImageUrlToCart(cart: CartWithItems) {
  return {
    ...cart,
    cartItems: cart.cartItems.map((cartItem) => ({
      ...cartItem,
      product: {
        ...cartItem.product,
        images: cartItem.product.images.map((image: any) => ({
          ...image,
          imageUrl: getPublicUrl({
            bucketName: process.env.AWS_S3_BUCKET_NAME!,
            objectKey: image.imageKey.replace(
              `${process.env.AWS_BUCKET_ENDPOINT_URL!}/`,
              ""
            ),
          }),
        })),
      },
    })),
  };
}

export function assignImageUrlToOrder(order: any) {
  return {
    ...order,
    orderItems: order.orderItems.map((orderItem: any) => ({
      ...orderItem,
      product: {
        ...orderItem.product,
        images: orderItem.product.images.map((image: any) => ({
          ...image,
          imageUrl: getPublicUrl({
            bucketName: process.env.AWS_S3_BUCKET_NAME!,
            objectKey: image.imageKey.replace(
              `${process.env.AWS_BUCKET_ENDPOINT_URL!}/`,
              ""
            ),
          }),
        })),
      },
    })),
  };
}

/**
 * Upload a file to an S3 bucket.
 * @param {{ bucketName: string, key: string, buffer: Buffer }}
 */
async function uploadFileToS3({
  bucketName,
  key,
  buffer,
}: {
  bucketName: string;
  key: string;
  buffer: Buffer;
}) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
  });

  try {
    const response = await getS3Client().send(command);
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === "EntityTooLarge"
    ) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      console.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
}

// Generate a presigned URL valid for 12 hours
async function getPresignedUrl({
  bucketName,
  objectKey,
}: {
  bucketName: string;
  objectKey: string;
}): Promise<string> {
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(getS3Client(), command, {
      expiresIn: 43200,
    });
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
}

// Generate a direct public URL for S3 objects
function getPublicUrl({
  bucketName,
  objectKey,
}: {
  bucketName: string;
  objectKey: string;
}): string {
  return `https://${bucketName}.s3.amazonaws.com/${objectKey}`;
}
