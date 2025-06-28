import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@repo/ui/components/ui/checkbox";

export function selectionColumn<TData>(): ColumnDef<TData> {
  const selectionCol: ColumnDef<TData> = {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: boolean | "indeterminate") => {
            table.toggleAllPageRowsSelected(!!value);
          }}
          aria-label="Select all"
          className="hover:cursor-default"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean | "indeterminate") => {
            row.toggleSelected(!!value);
          }}
          aria-label="Select row"
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
            e.stopPropagation()
          }
          className="hover:cursor-default"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  return selectionCol;
}
