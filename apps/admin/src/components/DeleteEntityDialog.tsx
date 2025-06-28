"use client";

import { ApiResult } from "@repo/shared";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import { useToast } from "@repo/ui/hooks/use-toast";
import React from "react";

interface DeleteEntityDialogProps<TData> {
  items: TData[]; // Generic items to delete
  deleteItem: (item: TData) => Promise<ApiResult<any>>; // Service function for deletion
  entityType: string; // Readable name
  refetch: Function;
}

const DeleteEntityDialog = <T,>({
  items,
  deleteItem,
  entityType,
  refetch,
}: DeleteEntityDialogProps<T>) => {
  const { toast } = useToast();

  async function handleDelete() {
    let success = true;
    let errorMessage = "";
    let isDemo = false;

    // Iterate over all items and delete them
    for (const item of items) {
      const result = await deleteItem(item);

      // If one of them not succeed, flag it
      if (!result.success) {
        success = false;
        errorMessage =
          result.message ||
          `There was a problem deleting one of the ${entityType}s.`;

        // Check if this is a demo product message
        if (result.message && result.message.includes("demo")) {
          isDemo = true;
        }
      }
    }

    if (!success) {
      toast({
        // Use default variant for demo products, destructive for other errors
        variant: isDemo ? "default" : "destructive",
        title: isDemo ? `Demo ${entityType}` : `Error deleting ${entityType}`,
        description: errorMessage,
      });
    } else {
      toast({
        variant: "default",
        description: `Selected ${entityType}s deleted successfully.`,
      });
    }

    refetch();
  }

  return (
    <AlertDialogContent className="max-w-sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Delete {entityType}</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the
          selected {entityType}
          (s).
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteEntityDialog;
