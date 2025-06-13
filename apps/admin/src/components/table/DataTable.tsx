"use client";

import { TableConfig } from "@/src/types/table";
import { DesktopTable } from "@/src/components/table/DesktopTable";
import { MobileTable } from "@/src/components/table/MobileTable";

interface DataTableProps<TData> {
  config: TableConfig<TData>;
}

/**
 * Main table component that orchestrates desktop and mobile views
 * Uses the new configuration-based approach for consistency
 */
export function DataTable<TData>({ config }: DataTableProps<TData>) {
  return (
    <div className="relative">
      <DesktopTable config={config} />
      <MobileTable config={config} />
    </div>
  );
}
