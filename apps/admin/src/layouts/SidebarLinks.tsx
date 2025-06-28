"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  CornerDownRight,
  Home,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

const SidebarLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const pathName = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    {
      href: "/orders",
      label: "Orders",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      href: "/products",
      label: "Products",
      icon: <Package className="h-4 w-4" />,
    },
    {
      href: "/collections",
      label: "Collections",
      icon: <CornerDownRight className="h-4 w-4" />,
    },
    // { href: "/customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
    // { href: "/analytics", label: "Analytics", icon: <LineChart className="h-4 w-4" /> },
  ];

  return (
    <nav className="grid items-start px-2 text-base font-medium lg:px-4">
      {links.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onLinkClick}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
            pathName === href
              ? "bg-muted text-primary"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {icon}
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default SidebarLinks;
