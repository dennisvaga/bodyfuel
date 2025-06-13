import { cn } from "#lib/cn";

/**
 * Skeleton loading component for content placeholders.
 *
 * Displays an animated placeholder that can be used during data loading
 * to indicate where content will appear, improving perceived performance.
 * Accepts all standard div props and can be styled with additional classes.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
