"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AppVariant } from "@repo/shared";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "#lib/cn";

type ModeToggleProps = {
  variant?: AppVariant;
  isDrawer?: boolean;
  className?: string;
};

export function ModeToggle({
  variant,
  isDrawer = false,
  className,
}: ModeToggleProps) {
  const { setTheme } = useTheme();
  const isShopVariant = variant === "shop";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isShopVariant ? "theme-toggle" : "outline"}
          size="icon"
          className={cn(
            "border-[hsl(12,6.5%,15.1%))] m-3",
            isDrawer && "bg-white",
            className
          )}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
