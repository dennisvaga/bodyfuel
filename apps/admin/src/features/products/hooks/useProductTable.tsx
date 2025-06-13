import { useMemo } from "react";
import { Row } from "@tanstack/react-table";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";
import {
  ENTITY_TYPES,
  productService,
  QUERY_KEYS,
  categoryService,
  useFetchQuery,
} from "@repo/shared";
import type { ProductWithImageUrl } from "@repo/database/types/product";
import { useTableConfig } from "@/src/hooks/useTableConfig";
import { getProductColumns } from "@/src/features/products/components/table/productColumns";

interface UseProductTableProps {
  paginationParams: {
    currentPage: number;
    itemsPerPage: number;
  };
}

/**
 * Product-specific table configuration hook
 * Handles data fetching, column setup, and actions
 */
export function useProductTable({ paginationParams }: UseProductTableProps) {
  // Fetch products data
  const {
    data: products,
    isLoading,
    pagination,
    refetch,
  } = useFetchQuery({
    queryKey: QUERY_KEYS.PRODUCTS_PAGINATED(paginationParams),
    serviceFn: () =>
      productService.getProducts({ pagination: paginationParams }),
  });

  // Fetch categories for column rendering
  const { data: categories } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    serviceFn: categoryService.getCategoriesNames,
  });

  // Generate columns with categories data
  const columns = useMemo(() => {
    return getProductColumns(categories ?? []);
  }, [categories]);

  // Row click handler
  const handleRowClick = (row: Row<ProductWithImageUrl>) => {
    redirect(`/products/${row.original.slug}`);
  };

  // Configure table with all settings
  const tableConfig = useTableConfig({
    columns,
    data: products ?? [],
    enableSelection: true,
    enableBulkActions: true,
    bulkActionConfig: {
      entityType: ENTITY_TYPES.PRODUCT,
      deleteItem: productService.deleteProduct,
      refetch,
    },
    primaryAction: {
      label: "Add Product",
      icon: PlusCircle,
      href: "/products/new",
      variant: "outline",
    },
    onRowClick: handleRowClick,
    isLoading,
  });

  return {
    tableConfig,
    pagination,
    isLoading,
  };
}
