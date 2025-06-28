"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import logoBright from "@rootMedia/logo-bright.svg";
import logoDark from "@rootMedia/logo-dark.svg";
import { useThemeAwareLogo } from "@repo/ui/hooks/useThemeAwareLogo";

interface CheckoutPageLayoutProps {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
}

/**
 * Layout component for checkout-related pages.
 * Provides a responsive two-column layout with logo positioning and theme awareness.
 */
const CheckoutPageLayout = ({
  mainContent,
  sidebarContent,
}: CheckoutPageLayoutProps) => {
  const { logoSrc } = useThemeAwareLogo(logoBright, logoDark);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Left main content*/}
      <div className="w-full">
        <div className="ml-auto max-w-[700px] w-full px-10 py-20">
          {/* Logo */}
          <div className="w-full pb-20 hidden md:flex">
            <Link href={"/"}>
              <Image
                priority
                className="w-[400px]"
                src={logoSrc}
                width={240}
                alt="BodyFuel Logo"
              />
            </Link>
          </div>

          {/* Main content */}
          {mainContent}
        </div>
      </div>

      {/* RIGHT: SIDEBAR, sticky at the top right, no extra padding */}
      <div className="w-full -order-1 md:order-1 bg-background">
        <aside className="sticky top-0 right-0 md:max-w-[380px] w-full px-10 md:py-20 pt-20">
          {/* Logo */}
          <div className="w-full pb-20 md:hidden">
            <Link href={"/"}>
              <Image
                priority
                className="w-[400px]"
                src={logoSrc}
                width={240}
                alt="BodyFuel Logo"
              />
            </Link>
          </div>

          {/* Sidebar content */}
          <div className="flex flex-col gap-4">{sidebarContent}</div>

          <div className="border-b border-gray-200 mt-8 md:hidden"></div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPageLayout;
