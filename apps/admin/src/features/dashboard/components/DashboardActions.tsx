"use client";

import { LayoutGrid, Plus, ListOrdered } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

export const DashboardActions = () => {
  const actions = [
    {
      href: "/products/new",
      icon: Plus,
      title: "Add New Product",
      description: "Create and publish a new product",
      color: "emerald" as const,
    },
    {
      href: "/orders",
      icon: ListOrdered,
      title: "View Orders",
      description: "Check your recent orders",
      color: "blue" as const,
    },
    {
      href: "/collections",
      icon: LayoutGrid,
      title: "Manage Collections",
      description: "Organize your products",
      color: "purple" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <DashboardCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};
