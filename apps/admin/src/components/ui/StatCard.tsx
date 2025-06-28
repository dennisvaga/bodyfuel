"use client";

import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  href?: string;
  icon: LucideIcon;
  title: string;
  value?: string | number;
  description?: string;
  trend?: string;
  gradientClass: string;
  iconBgClass: string;
  children?: ReactNode;
  variant?: "stat" | "action";
}

export const StatCard = ({
  href,
  icon: Icon,
  title,
  value,
  description,
  trend,
  gradientClass,
  iconBgClass,
  children,
  variant = "stat",
}: StatCardProps) => {
  const CardContent = (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 ${
        href ? "cursor-pointer" : ""
      } ${variant === "action" ? "p-6" : "p-6"}`}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradientClass}`}
      />

      <div className="relative">
        {variant === "stat" ? (
          // Stats layout
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`p-2.5 rounded-xl ${iconBgClass} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {href && (
                  <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {value}
                  </h3>
                  {trend && (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Actions layout
          <>
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${iconBgClass} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              {href && (
                <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
                {title}
              </h5>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>
          </>
        )}

        {children}
      </div>
    </Card>
  );

  return href ? (
    <Link href={href} className="block">
      {CardContent}
    </Link>
  ) : (
    CardContent
  );
};
