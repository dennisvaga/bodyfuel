"use client";

import { Button } from "@repo/ui/components/ui/button";
import { TableConfig } from "@/src/types/table";
import Link from "next/link";

interface MobileSelectionHeaderProps<TData> {
  config: TableConfig<TData>;
  isSelectionMode: boolean;
  setIsSelectionMode: (value: boolean) => void;
  selectedCount: number;
}

/**
 * Mobile header controls for selection mode and primary actions
 */
export function MobileSelectionHeader<TData>({
  config,
  isSelectionMode,
  setIsSelectionMode,
  selectedCount,
}: MobileSelectionHeaderProps<TData>) {
  if (!config.enableSelection && !config.primaryAction) {
    return null;
  }

  const handleSelectionToggle = () => {
    setIsSelectionMode(!isSelectionMode);
    // Clear selections when exiting selection mode
    if (isSelectionMode && config.selection) {
      config.selection.setRowSelection({});
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2 w-full justify-between">
        {/* Selection toggle button */}
        {config.enableSelection && config.selection && (
          <Button
            variant={isSelectionMode ? "destructive" : "outline"}
            size="sm"
            onClick={handleSelectionToggle}
          >
            {isSelectionMode ? "Cancel" : "Select Items"}
          </Button>
        )}

        {/* Primary action (e.g. Add Product) */}
        {!isSelectionMode && config.primaryAction && (
          <div className="flex gap-2">
            {config.primaryAction.href ? (
              <Link href={config.primaryAction.href}>
                <Button
                  size="sm"
                  variant={config.primaryAction.variant || "outline"}
                >
                  <config.primaryAction.icon className="h-3.5 w-3.5" />
                  {config.primaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant={config.primaryAction.variant || "outline"}
                onClick={config.primaryAction.onClick}
              >
                <config.primaryAction.icon className="h-3.5 w-3.5" />
                {config.primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Selected count indicator */}
      {isSelectionMode && selectedCount > 0 && (
        <span className="text-sm text-muted-foreground">
          {selectedCount} selected
        </span>
      )}
    </div>
  );
}
