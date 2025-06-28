"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@repo/ui/components/ui/dropdown-menu";
import { Button } from "@repo/ui/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AlertDialog } from "@repo/ui/components/ui/alert-dialog";
import DeleteEntityDialog from "@/src/components/DeleteEntityDialog";

/**
 * Menu with delete option
 */
export function getActionsColumn<TData>(options: {
  deleteItem?: (item: number) => Promise<any>;
  entityType: string; // For UI
  showDeleteAlert?: boolean;
  setShowDeleteAlert?: (value: boolean) => void;
  refetch: Function;
}): ColumnDef<TData> {
  const {
    deleteItem,
    entityType,
    showDeleteAlert,
    setShowDeleteAlert,
    refetch,
  } = options;

  return {
    id: "actions",
    header: ({ table }) => {
      const hasSelectedRows = table.getSelectedRowModel().rows.length > 0;

      return (
        <>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              className={
                !hasSelectedRows ? "opacity-0 pointer-events-none" : ""
              }
              asChild
            >
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => setShowDeleteAlert?.(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {showDeleteAlert && (
            <AlertDialog
              open={showDeleteAlert}
              onOpenChange={setShowDeleteAlert}
            >
              {deleteItem && (
                <DeleteEntityDialog
                  items={table
                    .getSelectedRowModel()
                    .rows.map((row) => (row.original as any).id)}
                  deleteItem={deleteItem}
                  entityType={entityType}
                  refetch={refetch}
                />
              )}
            </AlertDialog>
          )}
        </>
      );
    },
  };
}
