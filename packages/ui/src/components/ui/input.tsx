import * as React from "react";

import { cn } from "#lib/cn";

/**
 * Styled input component with consistent design system styling.
 *
 * Provides a standard text input with theming, focus states, and sizing
 * that matches the rest of the UI system.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full caret-gray-400 rounded-md border border-input bg-background px-2.5 py-2 text-base ring-offset-background file:py-2 file:border-0 file:bg-transparent file:text-base file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/**
 * Type alias for standard input props, used by related components
 * that extend input functionality.
 */
export type InputProps = React.ComponentProps<"input">;

export { Input };
