/**
 * Desktop navigation bar - shows logo, navigation links and action icons.
 * Visible only on larger screens (xl breakpoint and above).
 * Includes inline search, dropdown menus and theme toggle.
 */

"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "@rootMedia/logo-dark.svg";
import MiniCartDrawer from "@/src/features/cart/components/MiniCartDrawer";
import AuthLink from "./AuthLink";
import DropdownMenu from "./DropDownMenu";
import { ProductSearch } from "@/src/features/search/components/ProductSearch";
import { ModeToggle } from "@repo/ui/components/theme-toggle";

interface DesktopNavBarProps {
  navigationItems: any[];
}

const DesktopNavBar = ({ navigationItems }: DesktopNavBarProps) => {
  return (
    <div className="hidden xl:flex items-center w-full">
      <Link href={"/"}>
        <Image className="-mt-2" src={logo} width={300} alt="Logo" />
      </Link>

      <nav className="w-full flex items-center">
        {/* Nav links */}
        <div className="flex ms-auto *:p-5 items-center">
          {navigationItems.map((item) => {
            if (item.dropdown) {
              return <DropdownMenu key={item.name} item={item} />;
            } else {
              return (
                <Link key={item.name} href={item.href}>
                  {item.name}
                </Link>
              );
            }
          })}
        </div>

        {/* Icons */}
        <div className="flex items-center ms-auto *:p-5">
          <ProductSearch className="!p-0" width="350px" />
          <ModeToggle variant="shop" />
          <AuthLink />
          <MiniCartDrawer />
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavBar;
