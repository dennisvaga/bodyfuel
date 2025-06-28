"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { AlertDialog } from "@repo/ui/components/ui/alert-dialog";
import { Check } from "lucide-react";
import { cn } from "@repo/ui/lib/cn";
import { TableConfig } from "@/src/types/table";
import { MobileSelectionHeader } from "./MobileSelectionHeader";
import { MobileActionsBar } from "./MobileActionsBar";
import DeleteEntityDialog from "@/src/components/DeleteEntityDialog";

interface MobileTableProps<TData> {
  config: TableConfig<TData>;
}

/**
 * Mobile-specific table component with card-based layout
 */
export function MobileTable<TData>({ config }: MobileTableProps<TData>) {
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Create base table options
  const tableOptions = {
    data: config.data,
    columns: config.columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => row.id.toString(),
  };

  // Add row selection properties if enabled
  if (config.enableSelection && config.selection) {
    Object.assign(tableOptions, {
      onRowSelectionChange: config.selection.setRowSelection,
      state: {
        rowSelection: config.selection.rowSelection,
      },
    });
  }

  const table = useReactTable(tableOptions);

  const selectedCount = config.selection?.selectedCount ?? 0;
  const selectedIds = config.selection?.selectedIds ?? [];

  return (
    <div className="md:hidden space-y-4">
      {/* Mobile Header Controls */}
      <MobileSelectionHeader
        config={config}
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        selectedCount={selectedCount}
      />

      {/* Mobile Cards */}
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <Card
            key={row.id}
            className={cn(
              "transition-colors relative",
              !isSelectionMode &&
                config.onRowClick &&
                "hover:cursor-pointer hover:bg-accent/50",
              isSelectionMode && "hover:cursor-pointer",
              row.getIsSelected() && "bg-accent border-primary"
            )}
            onClick={() => {
              if (
                isSelectionMode &&
                config.enableSelection &&
                config.selection
              ) {
                // In selection mode: toggle selection
                config.selection.setRowSelection((prev) => ({
                  ...prev,
                  [row.id]: !prev[row.id],
                }));
              } else if (!isSelectionMode && config.onRowClick) {
                // In normal mode: navigate to edit
                config.onRowClick(row);
              }
            }}
          >
            {/* Selection indicator for mobile */}
            {isSelectionMode && (
              <div className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center">
                {row.getIsSelected() ? (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                ) : (
                  <div className="w-5 h-5 border-2 border-muted-foreground rounded-full" />
                )}
              </div>
            )}

            <CardContent className="p-4">
              <div className="space-y-2">
                {row.getVisibleCells().map((cell) => {
                  // Skip selection and actions columns for mobile display
                  if (
                    cell.column.id === "select" ||
                    cell.column.id === "actions"
                  ) {
                    return null;
                  }

                  // Get the header from the table's header groups
                  const headerGroup = table.getHeaderGroups()[0];
                  const correspondingHeader = headerGroup?.headers.find(
                    (h) => h.column.id === cell.column.id
                  );

                  const headerText = correspondingHeader
                    ? correspondingHeader.isPlaceholder
                      ? ""
                      : flexRender(
                          correspondingHeader.column.columnDef.header,
                          correspondingHeader.getContext()
                        )
                    : "";

                  return (
                    <div
                      key={cell.id}
                      className="flex justify-between text-right items-start"
                    >
                      <span className="text-sm font-medium text-muted-foreground min-w-0 flex-shrink-0 mr-4">
                        {headerText}
                      </span>
                      <div className="text-sm flex-1 min-w-0 flex justify-end">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No results.</p>
          </CardContent>
        </Card>
      )}

      {/* Mobile Actions Bar */}
      <MobileActionsBar
        config={config}
        selectedCount={selectedCount}
        selectedIds={selectedIds}
        isSelectionMode={isSelectionMode}
      />

      {/* Delete Confirmation Dialog */}
      {config.showDeleteAlert &&
        config.enableBulkActions &&
        config.bulkActionConfig?.deleteItem && (
          <AlertDialog
            open={config.showDeleteAlert}
            onOpenChange={config.setShowDeleteAlert}
          >
            <DeleteEntityDialog
              items={selectedIds.map((id) => parseInt(id))}
              deleteItem={config.bulkActionConfig.deleteItem}
              entityType={config.bulkActionConfig.entityType}
              refetch={config.bulkActionConfig.refetch}
            />
          </AlertDialog>
        )}
    </div>
  );
}
