"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AppVariant } from "@repo/shared";
import { Button } from "#components/ui/button";
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
            "m-3 shrink-0",
            isDrawer && "bg-white dark:bg-[hsla(0,0%,5%,0.5)]",
            className
          )}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
