"use client";
import { useRef, useState } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { ApiResult, getEntityLabel } from "@repo/shared";
import { ENTITY_TYPES } from "@repo/shared";

/**
 * Manage row selection state for related entities
 * @param entities
 */
export function useRelatedEntitySelection<T extends { id: number }>(
  entities: T[] | undefined
): [
  RowSelectionState,
  React.Dispatch<React.SetStateAction<RowSelectionState>>,
] {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
    if (!entities?.length) return {};
    return Object.fromEntries(
      entities.map((entity) => [entity.id.toString(), true])
    );
  });

  return [rowSelection, setRowSelection];
}

/**
 * Generic form submission handler for entity forms
 */
export function useEntitySubmit<T, R = any>({
  entityType,
  entityId,
  addEntity,
  editEntity,
  onSuccess,
  showSuccessToast,
  showErrorToast,
}: {
  entityType: ENTITY_TYPES;
  entityId?: number;
  addEntity: (data: T) => Promise<ApiResult<R>>;
  editEntity?: (id: number, data: T) => Promise<ApiResult<R>>;
  onSuccess?: (result: ApiResult<R>, isEdit: boolean) => void;
  showSuccessToast: (entityType: string) => void;
  showErrorToast: (message?: string) => void;
}) {
  const entityName = getEntityLabel(entityType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (data: T) => {
    if (isSubmitting) return { success: false };

    setIsSubmitting(true);

    try {
      let result;
      const isEdit = !!entityId;

      if (isEdit) {
        result = await editEntity?.(entityId, data);
      } else {
        result = await addEntity(data);
      }

      if (!result?.success) {
        showErrorToast(result?.message);
        return result;
      }

      if (entityType !== ENTITY_TYPES.CHECKOUT) {
        showSuccessToast(entityName);
      }

      // Reset file input if it exists
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onSuccess) {
        onSuccess(result, isEdit);
      }

      return result;
    } catch (error) {
      showErrorToast((error as Error).message);
      return { success: false, message: (error as Error).message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    fileInputRef,
    isSubmitting,
  };
}
