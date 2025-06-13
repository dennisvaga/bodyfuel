import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  TableConfig,
  BulkActionConfig,
  PrimaryAction,
} from "@/src/types/table";
import { useTableSelection } from "@/src/hooks/useTableSelection";
import { selectionColumn } from "@/src/components/table/selectionColumn";
import { getActionsColumn } from "@/src/components/table/actionsColumn";

interface UseTableConfigProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableSelection?: boolean;
  enableBulkActions?: boolean;
  bulkActionConfig?: BulkActionConfig;
  primaryAction?: PrimaryAction;
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
}

/**
 * Main hook to configure tables with standardized behavior
 * Handles column assembly, selection state, and bulk actions
 */
export function useTableConfig<TData>({
  columns,
  data,
  enableSelection = false,
  enableBulkActions = false,
  bulkActionConfig,
  primaryAction,
  onRowClick,
  isLoading = false,
}: UseTableConfigProps<TData>): TableConfig<TData> {
  // Selection state management
  const selection = useTableSelection();

  // Delete alert state management
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Assemble columns with selection and actions if enabled
  const finalColumns = useMemo(() => {
    let tableColumns: ColumnDef<TData>[] = [];

    // Add selection column if enabled
    if (enableSelection) {
      tableColumns.push(selectionColumn<TData>());
    }

    // Add main columns
    tableColumns = tableColumns.concat(columns);

    // Add actions column if bulk actions are enabled (only for desktop)
    if (enableBulkActions && bulkActionConfig) {
      tableColumns.push(
        getActionsColumn<TData>({
          deleteItem: bulkActionConfig.deleteItem,
          entityType: bulkActionConfig.entityType,
          showDeleteAlert: showDeleteAlert,
          setShowDeleteAlert: setShowDeleteAlert,
          refetch: bulkActionConfig.refetch,
        })
      );
    }

    return tableColumns;
  }, [
    columns,
    enableSelection,
    enableBulkActions,
    bulkActionConfig,
    showDeleteAlert,
    setShowDeleteAlert,
  ]);

  return {
    columns: finalColumns,
    data,
    enableSelection,
    enableBulkActions,
    primaryAction,
    onRowClick,
    isLoading,
    // Include selection state if enabled
    ...(enableSelection && {
      selection: {
        rowSelection: selection.rowSelection,
        setRowSelection: selection.setRowSelection,
        selectedCount: selection.selectedCount,
        selectedIds: selection.selectedIds,
      },
    }),
    // Include actions if enabled
    ...(enableBulkActions && {
      showDeleteAlert: showDeleteAlert,
      setShowDeleteAlert: setShowDeleteAlert,
      bulkActionConfig,
    }),
  };
}
