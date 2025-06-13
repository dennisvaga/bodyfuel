import { Loader2 } from "lucide-react";
import { cn } from "#lib/cn";

interface LoadAnimationProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadAnimation = ({ size = "lg", className }: LoadAnimationProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
};

export default LoadAnimation;
