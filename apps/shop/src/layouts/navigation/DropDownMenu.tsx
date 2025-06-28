/**
 * Dropdown menu for navigation items with sub-pages.
 * Used in desktop navigation for categories/collections.
 * Shows on hover with smooth transition animation.
 */

"use client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavItem } from "./hooks/useNavigation";

interface DropdownMenuProps {
  item: NavItem;
}

/**
 * Desktop dropdown menu
 * @param param0
 * @returns
 */
export const DropdownMenu = ({ item }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 py-2">
        {item.name}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 bg-card text-card-foreground w-48 rounded-xl z-50 shadow-md border">
          {item.dropdown?.map((dropdownItem: any, index: number) => (
            <Link
              key={dropdownItem.name}
              href={dropdownItem.href}
              className={`block px-4 py-2 transition-colors hover:bg-accent hover:text-accent-foreground ${
                index === 0 ? "rounded-t-xl" : ""
              } ${index === item.dropdown!.length - 1 ? "rounded-b-xl" : ""}`}
              onClick={() => setIsOpen(false)}
            >
              {dropdownItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
