"use client";

import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  categoryService,
  ProductFormInput,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import { Label } from "@repo/ui/components/ui/label";
import FloatingInput from "@repo/ui/components/FloatingInput";
import FloatingSelect from "@repo/ui/components/FloatingSelect";
import FloatingTextarea from "@repo/ui/components/FloatingTextarea";
import { Button } from "@repo/ui/components/ui/button";

interface props {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const ProductDetails = ({ fileInputRef }: props) => {
  const { control } = useFormContext<ProductFormInput>();
  const { data: categories } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    serviceFn: categoryService.getCategoriesNames,
  });

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => <FloatingInput field={field} label="Name" />}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FloatingTextarea field={field} label="Description" />
        )}
      />

      <FormField
        control={control}
        name="brand"
        render={({ field }) => <FloatingTextarea field={field} label="Brand" />}
      />

      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FloatingSelect
            field={field}
            label="Category"
            selectOptions={categories ?? []}
          />
        )}
      />

      <FormField
        control={control}
        name="price"
        render={({ field }) => <FloatingInput field={field} label="Price" />}
      />

      <FormField
        control={control}
        name="quantity"
        render={({ field }) => <FloatingInput field={field} label="Quantity" />}
      />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="flex">
                <div>
                  <Button className="my-4" type="button" variant={"outline"}>
                    <Label htmlFor="image">Select Images</Label>
                  </Button>
                  <Label className="list-disc list-inside ml-2">
                    {field.value &&
                      field.value.length > 0 &&
                      `${field.value.length} selected`}
                  </Label>
                </div>

                <Input
                  id="image"
                  type="file"
                  ref={fileInputRef}
                  multiple
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      // Store the array of File objects
                      field.onChange(Array.from(files));
                    }
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductDetails;
