import React, { ForwardedRef, forwardRef } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { Send } from "lucide-react";
import { cn } from "@repo/ui/lib/cn";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = forwardRef(
  (
    { value, onChange, onSubmit, isLoading }: ChatInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <form
        onSubmit={onSubmit}
        className="p-3 border-t border-border flex gap-2 bg-card items-center rounded-b-xl"
      >
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder="Ask about our products..."
          className={cn(
            "flex-1 p-2 border rounded-xl bg-background text-foreground",
            "border-input focus:border-primary focus:ring-1 focus:ring-primary"
          )}
          // Keep input enabled for typing even when loading
        />
        <Button type="submit" size="sm" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    );
  }
);

ChatInput.displayName = "ChatInput";
