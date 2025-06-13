"use client";

import { Button } from "@repo/ui/components/ui/button";
import { Trash2 } from "lucide-react";
import { TableConfig } from "@/src/types/table";

interface MobileActionsBarProps<TData> {
  config: TableConfig<TData>;
  selectedCount: number;
  selectedIds: string[];
  isSelectionMode: boolean;
}

/**
 * Mobile floating action bar for bulk operations
 */
export function MobileActionsBar<TData>({
  config,
  selectedCount,
  selectedIds,
  isSelectionMode,
}: MobileActionsBarProps<TData>) {
  if (
    !config.enableBulkActions ||
    !isSelectionMode ||
    selectedCount === 0 ||
    !config.setShowDeleteAlert
  ) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => config.setShowDeleteAlert!(true)}
        size="lg"
        variant="destructive"
        className="rounded-full shadow-lg h-14 w-14 p-0"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
      <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium">
        {selectedCount}
      </div>
    </div>
  );
}
