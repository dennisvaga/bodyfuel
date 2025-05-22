"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  RowSelectionState,
  useReactTable,
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

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  handleRowClick?: (row: Row<TData>) => void;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
}

/**
 * Generic tanstack table component that receives columns
 * and data to render.
 * @param param0
 * @returns
 */
export function DataTable<TData>({
  data,
  columns,
  handleRowClick,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData>) {
  // Create base table options
  const tableOptions = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: any) => row.id.toString(),
  };

  // Only add row selection properties if provided
  if (rowSelection !== undefined && setRowSelection !== undefined) {
    Object.assign(tableOptions, {
      onRowSelectionChange: setRowSelection,
      state: {
        rowSelection,
      },
    });
  }

  // Table initialization with the appropriate options
  const table = useReactTable(tableOptions);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                onClick={(e) => {
                  if (handleRowClick) {
                    handleRowClick(row);
                  }
                }}
                className={cn(
                  "table-row data-[state=selected]:bg-inherit",
                  handleRowClick && "hover:cursor-pointer"
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
