/**
 * Custom hook for navigation state and items.
 *
 * - Fetches dynamic navigation items from categories and collections
 * - Builds a list of NavItems with optional dropdowns
 * - Manages mobile menu open/close state
 *
 * Used in Navbar to render desktop dropdowns and mobile menu drawer.
 */

import {
  categoryService,
  collectionService,
  QUERY_KEYS,
  useFetchQuery,
} from "@repo/shared";
import { useState } from "react";

export interface NavDropdownItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href: string;
  dropdown?: NavDropdownItem[];
}

export const useNavigation = () => {
  const { data: categories } = useFetchQuery({
    queryKey: QUERY_KEYS.CATEGORIES,
    serviceFn: categoryService.getCategoriesNames,
  });

  const { data: collections } = useFetchQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    serviceFn: collectionService.getCollections,
  });

  // Navigation structure
  const navigationItems: NavItem[] = [
    {
      name: "SHOP",
      href: "",
      dropdown:
        collections?.map((collection) => ({
          name: collection.name,
          href: `/collections/${collection.slug}`,
        })) ?? [],
    },
    {
      name: "CATEGORIES",
      href: "",
      dropdown:
        categories?.map((category) => ({
          name: category.name,
          href: `/categories/${category.slug}`,
        })) ?? [],
    },

    {
      name: "ABOUT",
      href: "/about",
    },
    {
      name: "CONTACT",
      href: "/contact-us",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  return {
    navigationItems,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };
};

export default useNavigation;
