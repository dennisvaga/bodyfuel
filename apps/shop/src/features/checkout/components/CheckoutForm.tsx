"use client";
import React from "react";
import { Form } from "@repo/ui/components/ui/form";
import { onErrors } from "@repo/shared";
import { Button } from "@repo/ui/components/ui/button";
import { CheckoutDetails } from "@/src/features/checkout/components/CheckoutDetails";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import LoadAnimation from "@repo/ui/components/LoadAnimation";

const CheckoutForm = () => {
  const { form, onSubmit, isSubmitting } = useCheckoutForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onErrors)}>
        <div className="flex flex-col gap-4">
          <CheckoutDetails></CheckoutDetails>
          {/* Save Form */}
          <Button className="" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <LoadAnimation /> : "Pay"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CheckoutForm;
