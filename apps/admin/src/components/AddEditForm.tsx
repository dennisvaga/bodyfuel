"use client";
import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Form } from "@repo/ui/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";

// Existing product to update
interface AddEditFormProps<T extends FieldValues> {
  heading: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
}

/**
 * react-hook-form to add or edit entity
 */
const AddEditForm = <T extends FieldValues>({
  heading,
  form,
  onSubmit,
  children, // Reserved prop
}: AddEditFormProps<T>) => {
  /**
   * Add or Edit entity
   * @param productData data from the form itself
   */
  async function handleFormSubmit(data: T) {
    await onSubmit(data);
  }

  async function onErrors(error: any) {
    // Process validation errors if needed
  }

  // Form = Form Provider
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit, onErrors)}>
        <div className="flex flex-col max-w-[700px] mx-auto gap-4">
          <h1 className="text-4xl"> {heading} </h1>
          {children}
          {/* Save Form */}
          <Button className="w-[20%] self-end" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddEditForm;
