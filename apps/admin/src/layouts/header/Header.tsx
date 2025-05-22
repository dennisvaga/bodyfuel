"use client";

import React, { useState } from "react";
import { CircleUser, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import { Button } from "@repo/ui/components/ui/button";
import { ModeToggle } from "@repo/ui/components/theme-toggle";
import SidebarLinks from "../sidebar/SidebarLinks";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProductSearch } from "@/src/features/search/components/ProductSearch";

const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Logout
   */
  function handleLogout() {
    signOut({ redirect: false }).then(() => {
      router.push("/signin"); // Redirect to Sign In after logout
    });
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      {/* Mobile side bar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <SheetTitle></SheetTitle>
          <SidebarLinks onLinkClick={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Product Search */}
      <ProductSearch />

      {/* Dark/light mode */}
      <ModeToggle variant="admin" />

      {/* Account management menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
