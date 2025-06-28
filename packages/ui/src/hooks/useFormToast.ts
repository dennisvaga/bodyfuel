import { useToast } from "#hooks/use-toast";

/**
 * Form submission toast notifications
 * @returns Functions to show success and error toasts
 */
export function useFormToast() {
  const { toast } = useToast();

  const showSuccessToast = (entityType: string) => {
    toast({
      variant: "default",
      description: `${entityType} saved successfully.`,
    });
  };

  const showErrorToast = (message?: string) => {
    toast({
      variant: "destructive",
      title: "Error",
      description: message || "Failed to save.",
    });
  };

  return { showSuccessToast, showErrorToast };
}
