"use client";

import React from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/ui/form";
import FloatingInput from "@repo/ui/components/FloatingInput";
import FloatingTextarea from "@repo/ui/components/FloatingTextarea";
import { useContactForm } from "../../features/contact/hooks/useContactForm";
import { onErrors, FEATURE_FLAGS } from "@repo/shared";

const ContactPage = () => {
  const { form, isSubmitting, onSubmit } = useContactForm();

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8 max-w-3xl min-h-[70vh]">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-center mb-8 text-muted-foreground">
        Have questions or feedback? Fill out the form below and we'll get back
        to you as soon as possible.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onErrors)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput field={field} label="Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput field={field} label="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingTextarea field={field} label="Message" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !FEATURE_FLAGS.CONTACT_FORM}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ContactPage;
