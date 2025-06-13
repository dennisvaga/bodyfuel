"use client";

import React, { useState } from "react";
import { CircleUser } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import { Button } from "@repo/ui/components/ui/button";
import { ModeToggle } from "@repo/ui/components/theme-toggle";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProductSearch } from "@/src/features/search/components/ProductSearch";
import MobileSidebar from "./MobileSidebar";

const Header = () => {
  const router = useRouter();

  /**
   * Logout
   */
  function handleLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/signin"); // Redirect to Sign In after logout
    });
  }

  return (
    <header className="border-b bg-muted/40">
      {/* Top row with navigation controls */}
      <div className="flex h-14 items-center gap-4 px-4 lg:h-[60px] lg:px-6 justify-between">
        {/* Mobile sidebar toggle */}
        <MobileSidebar />

        {/* Product Search - hidden on md and below */}
        <div className="hidden sm:flex flex-1">
          <ProductSearch />
        </div>

        <div className="space-x-2">
          {/* Dark/light mode */}
          <ModeToggle variant="admin" />

          {/* Account management menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shrink-0"
              >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:cursor-pointer" disabled>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" disabled>
                Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Product Search - full width on md and below */}
      <div className="sm:hidden px-4 pb-4">
        <ProductSearch />
      </div>
    </header>
  );
};

export default Header;
