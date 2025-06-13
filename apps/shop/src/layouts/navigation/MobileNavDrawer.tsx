/**
 * Mobile navigation drawer - shows full navigation menu for mobile.
 * Appears when hamburger menu is clicked.
 * Contains navigation links with dropdowns and theme toggle.
 */

"use client";
import Link from "next/link";
import { NavItem } from "./hooks/useNavigation";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Drawer,
  DrawerClose,
} from "@repo/ui/components/ui/drawer";
import { X } from "lucide-react";
import { ModeToggle } from "@repo/ui/components/theme-toggle";
import AuthLink from "./AuthLink";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
      <DrawerContent className="fixed py-4 px-5 w-full max-w-[300px] xl:hidden text-dark border-none bg-background">
        <div className="flex justify-between items-center mb-6">
          <DrawerHeader className="p-0">
            <DrawerTitle className="text-lg font-bold">Menu</DrawerTitle>
          </DrawerHeader>
          {/* Close button with X icon */}
          <DrawerClose className="text-dark hover:cursor-pointer rounded-full">
            <div className="p-2">
              <X className="w-5 h-5" />
            </div>
          </DrawerClose>
        </div>

        <nav className="flex flex-col">
          {/* Authentication link - shows Login/Account text with icon based on auth status */}
          <div className="py-3">
            <AuthLink
              className="text-base font-semibold flex items-center"
              onClick={() => setIsOpen(false)}
              displayText={true}
            />
          </div>

          {/* Theme toggle section */}
          <div className="flex items-center space-x-2 pb-6 border-b ">
            <span className="font-semibold">Theme</span>
            <ModeToggle variant="shop" isDrawer={true} />
          </div>

          {navigationItems.map((item) => (
            <div key={item.name} className="py-2">
              {item.dropdown && item.dropdown.length > 0 ? (
                <Collapsible className="w-full relative">
                  <div className="flex items-center justify-between">
                    {/* If item has a valid href, make it clickable */}
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-base font-semibold py-2 flex-grow"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-base font-semibold py-2">
                        {item.name}
                      </span>
                    )}

                    <CollapsibleTrigger className="p-2 rounded-ful absolute right-0 left-0">
                      <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180 absolute right-0" />
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <div className="pl-4 space-y-1 mt-1">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block py-1.5 text-base text-gray-700 dark:text-gray-200 hover:text-primary transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  className="text-base font-semibold py-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;
