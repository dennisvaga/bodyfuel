import type { Category } from "@repo/database/types/category";

export const categoryIdToName = (catId: number, categories: Category[]) => {
  return categories?.find((category) => category.id === catId)?.name;
};

export const categoryNameToId = (catName: string, categories: Category[]) => {
  return categories?.find((category) => category.name === catName)?.id;
};
