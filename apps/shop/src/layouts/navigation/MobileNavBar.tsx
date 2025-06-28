/**
 * Mobile navigation bar - shows hamburger menu, logo and action icons.
 * Visible only on smaller screens (below xl breakpoint).
 * Opens search in a modal dialog when search icon is clicked.
 */

"use client";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "@rootMedia/logo-dark.svg";
import MiniCartDrawer from "@/src/features/cart/components/MiniCartDrawer";
import { AuthLink } from "./AuthLink";
import { ProductSearch } from "@/src/features/search/components/ProductSearch";
interface MobileNavBarProps {
  onOpenMenu: () => void;
}

const MobileNavBar = ({ onOpenMenu }: MobileNavBarProps) => {
  return (
    <div className="xl:hidden w-full flex flex-col md:gap-0 gap-4">
      {/* First row: Hamburger menu, Logo, Search & Icons */}
      <div className="flex items-center">
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
        <div className="flex items-center ms-auto *:p-3">
          <ProductSearch className="md:flex hidden" width="350px" />
          <AuthLink className="hidden sm:flex" />
          <MiniCartDrawer />
        </div>
      </div>
      {/* Second row: Search */}
      <div>
        <ProductSearch className="md:hidden flex mb-1" />
      </div>
    </div>
  );
};

export default MobileNavBar;
