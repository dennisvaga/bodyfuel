"use client";

import { useState } from "react";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Button } from "@repo/ui/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@repo/ui/components/ui/dialog";
import { DataTable } from "./table/DataTable";
import { selectionColumn } from "./table/selectionColumn";
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

  // Construct columns with selection
  let columnsWithSelection: ColumnDef<TData>[] = [];
  columnsWithSelection.push(selectionColumn<TData>());
  columnsWithSelection = columnsWithSelection.concat(columns);

  return (
    <>
      {/* Selected Entities Table */}
      <DataTable
        // Filter to show only the selected entities
        data={entityData?.filter((entity) => rowSelection[entity.id.toString()]) ?? []}
        columns={columns}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />

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
            <DataTable
              data={entityData ?? []}
              columns={columnsWithSelection}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
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
