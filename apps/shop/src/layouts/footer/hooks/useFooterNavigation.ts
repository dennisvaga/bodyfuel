import { NavItem } from "../../navigation/hooks/useNavigation";

export const useFooterNavigation = () => {
  // Static footer links - no API calls needed
  const footerNavigationItems: NavItem[] = [
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact-us",
    },
  ];

  return {
    navigationItems: footerNavigationItems,
  };
};

export default useFooterNavigation;
