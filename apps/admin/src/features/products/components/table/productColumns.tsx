"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import Image from "next/image";
import blankImage from "@rootMedia/blankImage.jpg";
import { categoryIdToName } from "@repo/shared";

/**
 * Product table columns factory function
 * Takes categories as parameter to avoid API calls in render
 */
export function getProductColumns(
  categories: any[] = []
): ColumnDef<ProductWithImageUrl>[] {
  return [
    {
      accessorKey: "images",
      header: "Image",
      cell: ({ row }) => {
        const imageUrl = row.original.images[0]?.imageUrl;
        return (
          <Image
            alt=""
            className="aspect-square rounded-md object-cover"
            height={64}
            width={64}
            src={imageUrl ?? blankImage}
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    //   {
    //     // Implement
    //     accessorKey: "status",
    //     header: "Status",
    //   },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.original.categoryId;
        const categoryName = categoryIdToName(categoryId, categories);
        return categoryName;
      },
    },
  ];
}
