/**
 * Mobile navigation drawer - shows full navigation menu for mobile.
 * Appears when hamburger menu is clicked.
 * Contains navigation links with dropdowns and theme toggle.
 */

"use client";
import Link from "next/link";
import { NavItem } from "./hooks/useNavigation";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Drawer,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import { X } from "lucide-react";
import { ModeToggle } from "@repo/ui/components/theme-toggle";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigationItems: NavItem[];
}

/**
 * Moboile drawer
 * @param param0
 * @returns
 */
const MobileNavDrawer = ({
  isOpen,
  setIsOpen,
  navigationItems,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      {/* padding values mimic the `div navbar` to match the icon position */}
      <DrawerContent className="fixed py-2 px-5 lg:px-10 w-full sm:w-[60%] lg:hidden bg-black text-dark border-none bg-background">
        <DrawerHeader className="hidden">
          <DrawerTitle></DrawerTitle>
        </DrawerHeader>
        <DrawerClose className="text-dark">
          {/* padding values mimic the `menu` icon to match the position */}
          <div className="p-3 lg:p-5">
            <X className="w-[28px] h-[28px]" />
          </div>
        </DrawerClose>
        <nav className="flex flex-col p-4">
          {navigationItems.map((item) => (
            <div key={item.name} className="py-3 border-b border-gray-400">
              <Link href={item.href} className="text-xl font-bold block mb-2">
                {item.name}
              </Link>
              <div className="pl-4 space-y-2">
                {item.dropdown?.map((dropdownItem) => (
                  <Link
                    key={dropdownItem.name}
                    href={dropdownItem.href}
                    className="block text-dark hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {dropdownItem.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Dark mode toggle in mobile menu */}
          <div className="py-6 flex items-center">
            <span className="text-xl font-bold mr-4">Theme</span>
            <ModeToggle variant="shop" />
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;
