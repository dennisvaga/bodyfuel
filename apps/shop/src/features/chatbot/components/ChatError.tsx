import React from "react";
import { Button } from "@repo/ui/components/ui/button";

interface ChatErrorProps {
  error: Error;
  onRetry: () => void;
}

export function ChatError({ error, onRetry }: ChatErrorProps) {
  return (
    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
      <p>
        {"We couldn't connect to our assistant right now. Please try again."}
      </p>
      <div className="flex justify-between items-center mt-2">
        <Button onClick={onRetry} variant="destructive" size="sm">
          Retry
        </Button>
        {process.env.NODE_ENV === "development" && (
          <span
            className="text-xs text-muted-foreground truncate max-w-[200px]"
            title={error.message}
          >
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
}
