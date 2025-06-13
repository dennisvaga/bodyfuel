import { ColumnDef, Row, RowSelectionState } from "@tanstack/react-table";
import { ReactNode } from "react";

export interface TableAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  handler: (selectedIds: string[]) => void;
  variant?: "default" | "destructive";
  requiresSelection?: boolean;
}

export interface PrimaryAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link";
}

export interface TableConfig<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  enableSelection?: boolean;
  enableBulkActions?: boolean;
  primaryAction?: PrimaryAction;
  onRowClick?: (row: Row<TData>) => void;
  isLoading?: boolean;
  // Selection state (added when enableSelection is true)
  selection?: TableSelectionState;
  // Bulk action properties (added when enableBulkActions is true)
  showDeleteAlert?: boolean;
  setShowDeleteAlert?: (value: boolean) => void;
  bulkActionConfig?: BulkActionConfig;
}

export interface TableSelectionState {
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  selectedCount: number;
  selectedIds: string[];
}

export interface BulkActionConfig {
  entityType: string;
  deleteItem?: (id: number) => Promise<any>;
  refetch: () => void;
}
