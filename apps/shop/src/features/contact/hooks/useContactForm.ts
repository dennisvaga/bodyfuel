"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useFormToast } from "@repo/ui/hooks/useFormToast";
import { contactSchema, ContactFormValues, ENTITY_TYPES, useEntitySubmit } from "@repo/shared";
import { contactService } from "../services/contactService";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

const initContactForm = (session: Session | null): ContactFormValues => ({
  name: "",
  email: session?.user?.email || "",
  message: "",
});

export const useContactForm = () => {
  const { showSuccessToast, showErrorToast } = useFormToast();
  const router = useRouter();
  const { data: session } = useSession();

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: initContactForm(session),
  });

  // Use shared submission logic
  const { handleSubmit } = useEntitySubmit({
    entityType: ENTITY_TYPES.CONTACT,
    addEntity: (data: ContactFormValues) => contactService.sendMessage(data),
    onSuccess: () => {
      form.reset(); // Reset form on success
      // Redirect to thank you page
      router.push("/thank-you?type=contact");
    },
    showSuccessToast,
    showErrorToast,
  });

  async function onSubmit(data: ContactFormValues) {
    await handleSubmit(data);
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
  };
};
