import React, { useState, useEffect } from "react";

interface ChatLoadingIndicatorProps {
  productStatus: string | null;
  productCount: number;
}

export function ChatLoadingIndicator({
  productStatus,
}: ChatLoadingIndicatorProps) {
  const [dots, setDots] = useState(".");

  // Cycle through dots for loading indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted p-3 rounded-lg mr-8 border border-border">
      <div className="flex space-x-3 items-center">
        <div>
          <span className="text-sm font-medium text-foreground">
            {productStatus || dots}
          </span>
        </div>
      </div>
    </div>
  );
}
