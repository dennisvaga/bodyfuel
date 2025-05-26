import React from "react";
import { Loader2 } from "lucide-react";

interface ChatLoadingIndicatorProps {
  productStatus: string | null;
  productCount: number;
}

export function ChatLoadingIndicator({
  productStatus,
  productCount,
}: ChatLoadingIndicatorProps) {
  return (
    <div className="bg-muted p-3 rounded-lg mr-8 border border-border">
      <div className="flex space-x-3 items-center">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div>
          <span className="text-sm font-medium text-foreground">
            {productStatus || "Processing your request"}
          </span>
          <p className="text-xs text-muted-foreground mt-1">
            {productCount > 0
              ? `Found ${productCount} products so far...`
              : "This may take a moment..."}
          </p>
        </div>
      </div>
    </div>
  );
}
