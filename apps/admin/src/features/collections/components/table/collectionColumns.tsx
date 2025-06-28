import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import { ColumnDef } from "@tanstack/react-table";

export const collectionColumns: ColumnDef<CollectionWithProductsImageUrl>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const productsCount = row.original.products?.length ?? 0;
      return productsCount;
    },
  },
];
