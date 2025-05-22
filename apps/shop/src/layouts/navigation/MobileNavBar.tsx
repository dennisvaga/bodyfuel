/**
 * Mobile navigation bar - shows hamburger menu, logo and action icons.
 * Visible only on smaller screens (below xl breakpoint).
 * Opens search in a modal dialog when search icon is clicked.
 */

"use client";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logo from "../../../../../public/media/logo-dark.svg";
import MiniCart from "@features/cart/components/MiniCart";
import AuthLink from "./AuthLink";
import { ProductSearch } from "@/src/features/search/components/ProductSearch";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";

interface MobileNavBarProps {
  onOpenMenu: () => void;
}

const MobileNavBar = ({ onOpenMenu }: MobileNavBarProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="xl:hidden flex w-full items-center">
      <div className="flex flex-row gap-4">
        {/* Hamburger Menu */}
        <button className="py-3" onClick={onOpenMenu}>
          <Menu className="w-[28px] h-[28px]" />
        </button>

        {/* Logo */}
        <Link href={"/"} className="flex-1 flex justify-center">
          <Image className="-mt-2" src={logo} width={240} alt="Logo" />
        </Link>
      </div>

      {/* Search & Icons */}
      <div className="flex ms-auto *:p-3">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <DialogTrigger asChild>
            <button>
              <Search className="w-[20px] h-[20px]" />
            </button>
          </DialogTrigger>

          <DialogOverlay />

          <DialogContent className="fixed left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2">
            <DialogTitle></DialogTitle>
            <ProductSearch
              autoFocus={true}
              onSearch={() => setSearchOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <AuthLink />
        <MiniCart />
      </div>
    </div>
  );
};

export default MobileNavBar;
