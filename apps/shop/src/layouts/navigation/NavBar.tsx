/**
 * Main navigation bar - adapts between mobile and desktop layouts.
 * Manages navigation state and provides layout container.
 * Hidden on the checkout page.
 */

"use client";
import { usePathname } from "next/navigation";
import useNavigation from "./hooks/useNavigation";
import MobileNavBar from "./MobileNavBar";
import MobileNavDrawer from "./MobileNavDrawer";
import DesktopNavBar from "./DesktopNavBar";

const NavBar = () => {
  const pathname = usePathname();
  const { navigationItems, isMobileMenuOpen, setIsMobileMenuOpen } =
    useNavigation();

  if (pathname === "/checkout") return null; // Hide on checkout

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--background-darker))] backdrop-blur-[5px] text-white shadow-md shadow-black/20">
      <div className="flex justify-center py-2 px-5 lg:px-10 text-base font-extrabold">
        {/* Mobile Navigation */}
        <MobileNavBar onOpenMenu={() => setIsMobileMenuOpen(true)} />

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          navigationItems={navigationItems}
        />

        {/* Desktop Navigation */}
        <DesktopNavBar navigationItems={navigationItems} />
      </div>
    </header>
  );
};

export default NavBar;
