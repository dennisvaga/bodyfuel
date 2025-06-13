import { useState, useMemo } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { TableSelectionState } from "@/src/types/table";

/**
 * Hook to manage table selection state consistently across all tables
 */
export function useTableSelection(): TableSelectionState {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const selectedCount = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]).length;
  }, [rowSelection]);

  const selectedIds = useMemo(() => {
    return Object.keys(rowSelection).filter((key) => rowSelection[key]);
  }, [rowSelection]);

  return {
    rowSelection,
    setRowSelection,
    selectedCount,
    selectedIds,
  };
}
