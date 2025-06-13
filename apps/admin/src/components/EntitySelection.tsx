"use client";

import { useState, useMemo } from "react";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { DataTable } from "./table/DataTable";
import { useTableConfig } from "@/src/hooks/useTableConfig";
import { ENTITY_TYPES, getEntityLabel } from "@repo/shared";

interface EntityTableProps<T> {
  entityType: ENTITY_TYPES; // For UI purposes only
  entityData: any[] | undefined;
  columns: any[];
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

/**
 * Shows user dialog to browse and select items
 * @param param0
 * @returns
 */
export function EntitySelection<TData extends { id: number }>({
  entityType,
  entityData,
  columns,
  rowSelection,
  setRowSelection,
}: EntityTableProps<TData>) {
  const entityName = getEntityLabel(entityType);
  const [openDialog, setOpenDialog] = useState(false);

  // Configuration for selected entities table (no selection needed)
  const selectedTableConfig = useTableConfig({
    columns,
    data:
      entityData?.filter((entity) => rowSelection[entity.id.toString()]) ?? [],
    enableSelection: false,
    enableBulkActions: false,
  });

  // Configuration for browse dialog table (with selection)
  const baseConfig = useTableConfig({
    columns,
    data: entityData ?? [],
    enableSelection: true,
    enableBulkActions: false,
  });

  // Override the internal selection state with external props
  const browseTableConfig = useMemo(() => {
    return {
      ...baseConfig,
      selection: {
        rowSelection,
        setRowSelection,
        selectedCount: Object.keys(rowSelection).filter(
          (key) => rowSelection[key]
        ).length,
        selectedIds: Object.keys(rowSelection).filter(
          (key) => rowSelection[key]
        ),
      },
    };
  }, [baseConfig, rowSelection, setRowSelection]);

  return (
    <>
      {/* Selected Entities Table */}
      <DataTable config={selectedTableConfig} />

      {/* Browse Button */}
      <Button
        className="my-4"
        type="button"
        variant={"outline"}
        onClick={() => setOpenDialog(true)}
      >
        Browse {entityName}s
      </Button>

      {/* Browse Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[80vh]">
          <DialogTitle>Select {entityName}s</DialogTitle>
          <div className="overflow-y-auto max-h-[calc(80vh-120px)]">
            <DataTable config={browseTableConfig} />
          </div>
          <Button
            className="justify-self-end"
            type="button"
            variant={"outline"}
            onClick={() => setOpenDialog(false)}
          >
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
