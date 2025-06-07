"use client";

import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { useFormContext } from "react-hook-form";
import { CollectionInput } from "@repo/shared";
import FloatingInput from "@repo/ui/components/FloatingInput";

/**
 * react-hook-form fields
 * @returns
 */
const CollectionDetails = () => {
  const { control } = useFormContext<CollectionInput>();

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
          <FloatingInput field={field} label="Description" />
        )}
      />
    </>
  );
};

export default CollectionDetails;
