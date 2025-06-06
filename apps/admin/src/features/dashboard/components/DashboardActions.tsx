"use client";

import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import { LayoutGrid, Plus, ListOrdered, ArrowUpRight } from "lucide-react";

export const DashboardActions = () => {
  const actions = [
    {
      href: "/products/new",
      icon: Plus,
      title: "Add New Product",
      description: "Create and publish a new product",
      iconBgClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      gradientClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    },
    {
      href: "/orders",
      icon: ListOrdered,
      title: "View Orders",
      description: "Check your recent orders",
      iconBgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
      gradientClass: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      href: "/collections",
      icon: LayoutGrid,
      title: "Manage Collections",
      description: "Organize your products",
      iconBgClass: "bg-gradient-to-br from-purple-500 to-purple-600",
      gradientClass: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <Link key={index} href={action.href} className="block">
            <Card className="group relative p-6 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm overflow-hidden">
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${action.gradientClass}`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${action.iconBgClass} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                    {action.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
