import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#lib/cn";

const buttonVariants = cva(
  "hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.03] hover:shadow-sm hover:shadow-primary/30 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.03] hover:shadow-sm hover:shadow-destructive/30 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
        outline:
          "border border-input bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-white/10 backdrop-blur-sm transition-colors duration-200",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/60 dark:hover:bg-white/10 transition-colors duration-200",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105 transition-all duration-200",
        "theme-toggle":
          "border dark:border-border border-gray-700 bg-[hsla(0,0%,5%,0.5)] hover:bg-white/10 transition-colors duration-200",
        "product-card":
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm hover:shadow-primary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
      },
      size: {
        default: "h-11.5 px-4 py-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  scale?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, scale = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Remove scale classes if scale is false
    const scaleClasses = scale ? "" : "hover:!scale-100";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          scaleClasses
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
