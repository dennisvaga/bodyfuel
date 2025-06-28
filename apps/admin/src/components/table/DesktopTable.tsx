"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { cn } from "@repo/ui/lib/cn";
import { TableConfig } from "@/src/types/table";

interface DesktopTableProps<TData> {
  config: TableConfig<TData>;
}

/**
 * Desktop-specific table component with traditional table layout
 */
export function DesktopTable<TData>({ config }: DesktopTableProps<TData>) {
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

  return (
    <div className="hidden md:block rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                onClick={() => {
                  if (config.onRowClick) {
                    config.onRowClick(row);
                  }
                }}
                className={cn(
                  "table-row data-[state=selected]:bg-inherit",
                  config.onRowClick && "hover:cursor-pointer"
                )}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={config.columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
