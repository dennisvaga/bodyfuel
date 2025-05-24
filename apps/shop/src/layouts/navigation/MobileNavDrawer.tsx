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
import AuthLink from "./AuthLink";

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigationItems: NavItem[];
}

/**
 * Mobile navigation drawer component
 * @param isOpen - Controls the visibility of the drawer
 * @param setIsOpen - State setter function to control the drawer state
 * @param navigationItems - Array of navigation items to display in the drawer
 * @returns A mobile navigation drawer or null if closed
 */
// ...existing code...
const MobileNavDrawer = ({
  isOpen,
  setIsOpen,
  navigationItems,
}: MobileMenuProps) => {
  // Early return if drawer is closed to prevent unnecessary rendering
  if (!isOpen) return null;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left">
      {/* Drawer content with improved styling */}
      <DrawerContent className="fixed py-4 px-5 w-full sm:w-[300px] xl:hidden text-dark border-none bg-background">
        <div className="flex justify-between items-center mb-6">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-lg font-bold">Menu</DrawerTitle>
          </DrawerHeader>
          {/* Close button with X icon */}
          <DrawerClose className="text-dark hover:bg-gray-100 rounded-full">
            <div className="p-2">
              <X className="w-5 h-5" />
            </div>
          </DrawerClose>
        </div>

        <nav className="flex flex-col">
          {/* Authentication link - shows Login/Account text with icon based on auth status */}
          <div className="py-3 mb-2">
            <AuthLink
              className="text-base font-semibold flex items-center"
              onClick={() => setIsOpen(false)}
              displayText={true}
            />
          </div>

          {/* Navigation sections with cleaner styling */}
          {navigationItems.map((item) => (
            <div key={item.name} className="py-2 border-t border-gray-200">
              {/* Main category label or link based on whether it has a dropdown */}
              {item.dropdown && item.dropdown.length > 0 ? (
                <h3 className="text-base font-semibold py-2 block">
                  {item.name}
                </h3>
              ) : (
                <Link
                  href={item.href}
                  className="text-base font-semibold py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}

              {/* Dropdown items container */}
              {item.dropdown && item.dropdown.length > 0 && (
                <div className="pl-4 space-y-1 mt-1">
                  {item.dropdown.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.name}
                      href={dropdownItem.href}
                      className="block py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {dropdownItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Theme toggle section */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center space-x-2">
            <span className="font-semibold">Theme</span>
            <ModeToggle variant="shop" isDrawer={true} />
          </div>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;
