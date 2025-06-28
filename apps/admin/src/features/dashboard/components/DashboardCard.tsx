import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";

interface DashboardCardProps {
  href?: string;
  icon: LucideIcon;
  title: string;
  value?: string | number;
  description?: string;
  color?: "emerald" | "blue" | "purple" | "primary";
}

export const DashboardCard = ({
  href,
  icon: Icon,
  title,
  value,
  description,
  color = "primary",
}: DashboardCardProps) => {
  // Get modern color classes based on color prop
  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case "emerald":
        return {
          icon: "bg-gradient-to-br from-emerald-600/80 to-emerald-700/80 dark:from-emerald-600/70 dark:to-emerald-700/70",
          hover:
            "group-hover:bg-emerald-50/5 dark:group-hover:bg-emerald-900/10",
          accent: "border-l-emerald-500/40 dark:border-l-emerald-400/30",
        };
      case "blue":
        return {
          icon: "bg-gradient-to-br from-blue-600/80 to-blue-700/80 dark:from-blue-600/70 dark:to-blue-700/70",
          hover: "group-hover:bg-blue-50/5 dark:group-hover:bg-blue-900/10",
          accent: "border-l-blue-500/40 dark:border-l-blue-400/30",
        };
      case "purple":
        return {
          icon: "bg-gradient-to-br from-purple-600/80 to-purple-700/80 dark:from-purple-600/70 dark:to-purple-700/70",
          hover: "group-hover:bg-purple-50/5 dark:group-hover:bg-purple-900/10",
          accent: "border-l-purple-500/40 dark:border-l-purple-400/30",
        };
      case "primary":
      default:
        return {
          icon: "bg-gradient-to-br from-primary/90 to-primary dark:from-primary/80 dark:to-primary/90",
          hover: "group-hover:bg-primary/5 dark:group-hover:bg-primary/10",
          accent: "border-l-primary/40 dark:border-l-primary/30",
        };
    }
  };

  const colorClasses = getColorClasses(color);
  const CardContent = (
    <Card
      className={`group relative overflow-hidden ${value !== undefined ? "" : `border-l-4 ${colorClasses.accent}`} bg-card/50 dark:bg-card/30 backdrop-blur-sm ${href ? "hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer" : "transition-colors duration-300"} ${value !== undefined ? "p-4" : "p-6"}`}
    >
      {/* Background hover overlay - only for clickable cards */}
      {href && (
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${colorClasses.hover}`}
        />
      )}

      <div className="relative">
        {value !== undefined ? (
          // Stats layout - compact horizontal design
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className={`p-2 rounded-lg ${colorClasses.icon} ${href ? "group-hover:scale-110 transition-transform duration-300" : ""}`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-row md:flex-col justify-between flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-0.5">
                  {title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {value}
                </h3>
              </div>
            </div>
            {href && (
              <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </div>
        ) : (
          // Actions layout
          <>
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${colorClasses.icon} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              {href && (
                <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-xl text-gray-900 dark:text-white group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors">
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
