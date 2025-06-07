import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#lib/cn";

const buttonVariants = cva(
  "hover:cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium ring-offset-background transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.03] hover:shadow-lg hover:shadow-destructive/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
        outline:
          "border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-background/80 text-gray-700 dark:text-gray-200 hover:border-primary/60 dark:hover:border-primary/60 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-primary dark:hover:text-primary backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-[1.03] hover:shadow-lg hover:shadow-secondary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
        ghost:
          "hover:bg-accent hover:text-accent-foreground before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-accent/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-400 before:ease-out",
        link: "text-primary underline-offset-4 hover:underline hover:scale-105",
        "theme-toggle":
          "border dark:border-border border-gray-700 bg-[hsla(0,0%,5%,0.5)] hover:bg-[hsla(12,6.5%,15.1%)] hover:text-[hsla(60,9.1%,97.8%)] hover:border-gray-500 hover:scale-[1.02] hover:shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out",
        "product-card":
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500 before:ease-out after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_70%)] after:scale-0 hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out",
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
