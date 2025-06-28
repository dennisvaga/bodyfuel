import { Row } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import {
  ENTITY_TYPES,
  collectionService,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import type { CollectionWithProductsImageUrl } from "@repo/database/types/collection";
import { useTableConfig } from "@/src/hooks/useTableConfig";
import { collectionColumns } from "@/src/features/collections/components/table/collectionColumns";

/**
 * Collection-specific table configuration hook
 * Handles data fetching, column setup, and actions
 */
export function useCollectionTable() {
  // Fetch collections data
  const { data: collections, refetch } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    serviceFn: () =>
      collectionService.getCollections({ includeProducts: true }),
  });

  // Row click handler
  const handleRowClick = (row: Row<CollectionWithProductsImageUrl>) => {
    redirect(`/collections/${row.original.slug}`);
  };

  // Configure table with all settings
  const tableConfig = useTableConfig({
    columns: collectionColumns,
    data: collections ?? [],
    enableSelection: true,
    enableBulkActions: true,
    bulkActionConfig: {
      entityType: ENTITY_TYPES.COLLECTION,
      deleteItem: collectionService.deleteCollection,
      refetch,
    },
    primaryAction: {
      label: "Add Collection",
      icon: PlusCircle,
      href: "/collections/new",
      variant: "outline",
    },
    onRowClick: handleRowClick,
    isLoading: false,
  });

  return {
    tableConfig,
  };
}
