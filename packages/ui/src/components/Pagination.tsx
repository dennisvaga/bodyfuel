"use client";

import { Button } from "#components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  PaginationMetadata,
  loadFormDataFromLocalStorage,
  saveFormDataToLocalStorage,
} from "@repo/shared";
import { useEffect } from "react";

interface PaginationProps {
  pagination: PaginationMetadata;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

const Pagination = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  pageSizeOptions = [10, 15, 25, 50, 100],
  className = "",
}: PaginationProps) => {
  // Destructure pagination metadata
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;

  // Load saved page size from local storage on component mount
  useEffect(() => {
    const storedData = loadFormDataFromLocalStorage<{ pageSize: number }>(
      "userPaginationPreference"
    );
    if (
      storedData &&
      storedData.pageSize &&
      storedData.pageSize !== itemsPerPage
    ) {
      onPageSizeChange(storedData.pageSize);
    }
  }, [onPageSizeChange, itemsPerPage]); // Include dependencies

  // Handler function to update page size and save to local storage
  const handlePageSizeChange = (value: string) => {
    const pageSize = Number(value);
    // Save the selected page size to local storage
    saveFormDataToLocalStorage("userPaginationPreference", { pageSize });
    // Call the parent's handler
    onPageSizeChange(pageSize);
  };

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 py-4 ${className}`}
    >
      <div className="text-sm text-muted-foreground text-center sm:text-left">
        {totalItems > 0 ? (
          <>
            Total: <span className="font-medium">{totalItems}</span> items
          </>
        ) : (
          "No items found"
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            <span className="hidden sm:inline">Rows per page</span>
            <span className="sm:hidden">Per page</span>
          </p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* First page button - hidden on mobile */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden sm:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          {/* Previous page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1 text-sm font-medium px-2">
            <span className="hidden sm:inline">Page</span>
            {currentPage}
            <span className="text-muted-foreground">of</span>
            {totalPages}
          </div>
          {/* Next page button */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {/* Last page button - hidden on mobile */}
          <Button
            variant="outline"
            className="h-8 w-8 p-0 hidden sm:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Pagination;
