"use client";

import Link from "next/link";
import logoBright from "@rootMedia/logo-bright.svg";
import logoDark from "@rootMedia/logo-dark.svg";
import Image from "next/image";
import { useThemeAwareLogo } from "@repo/ui/hooks/useThemeAwareLogo";
import SidebarLinks from "./SidebarLinks";

const DesktopSidebar = () => {
  const { logoSrc } = useThemeAwareLogo(logoBright, logoDark);

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          {/* Logo */}
          <Link href={"/"} className="flex-1 flex justify-center">
            <Image
              className="-mt-2"
              src={logoSrc}
              width={240}
              alt="Logo"
              priority
            />
          </Link>
        </div>
        <div className="flex-1">
          <SidebarLinks></SidebarLinks>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
