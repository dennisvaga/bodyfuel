import { ProductFormInput } from "#products/schema/productSchema";
import { ProductInputField } from "#products/types/productEnums";

export function parseProductBody(body: any) {
  return {
    name: body.name,
    description: body.description,
    brand: body.brand,
    categoryId: body.categoryId,
    price: body.price,
    quantity: body.quantity,
    collections: JSON.parse(body.collections || "[]"),
    variants: JSON.parse(body.variants || "[]"),
    options: JSON.parse(body.options || "[]"),
  };
}

export function constructProductFormData(data: ProductFormInput) {
  const formData = new FormData();
  formData.append(ProductInputField.NAME, data.name);
  formData.append(ProductInputField.DESCRIPTION, data.description || "");
  formData.append(ProductInputField.BRAND, data.brand || "");
  formData.append(ProductInputField.PRICE, data.price.toString());
  formData.append(ProductInputField.QUANTITY, data.quantity.toString());
  formData.append(ProductInputField.CATEGORY_ID, data.categoryId.toString());

  data.images?.forEach((image: any) => {
    formData.append(ProductInputField.IMAGES, image);
  });

  formData.append(ProductInputField.COLLECTIONS, JSON.stringify(data.collections || []));
  formData.append(ProductInputField.VARIANTS, JSON.stringify(data.variants || []));
  formData.append(ProductInputField.OPTIONS, JSON.stringify(data.options || []));

  return formData;
}
