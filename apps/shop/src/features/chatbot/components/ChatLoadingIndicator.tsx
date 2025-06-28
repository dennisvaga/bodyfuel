import React, { useState, useEffect } from "react";
import { Bot } from "lucide-react";

interface ChatLoadingIndicatorProps {
  productStatus: string | null;
  productCount: number;
}

export function ChatLoadingIndicator({
  productStatus,
}: ChatLoadingIndicatorProps) {
  const [dotCount, setDotCount] = useState(1);

  // Cycle through dot count for loading indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => {
        if (prev === 1) return 2;
        if (prev === 2) return 3;
        return 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-muted p-3 rounded-lg mr-8 border border-border">
      <div className="flex space-x-3 items-center">
        <Bot className="h-5 w-5 text-primary" />
        <div className="flex items-center space-x-1">
          {productStatus ? (
            <span className="text-sm font-medium text-foreground">
              {productStatus}
            </span>
          ) : (
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`w-1 h-1 rounded-full bg-primary transition-opacity duration-300 ${
                    dot <= dotCount ? "opacity-100" : "opacity-30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
