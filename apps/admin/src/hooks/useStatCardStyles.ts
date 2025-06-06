import { LucideIcon } from "lucide-react";

export interface StatCardConfig {
  href?: string;
  icon: LucideIcon;
  title: string;
  value?: string | number;
  description?: string;
  trend?: string;
  gradientClass: string;
  iconBgClass: string;
}

export const useStatCardStyles = () => {
  const getColorScheme = (
    type:
      | "primary"
      | "secondary"
      | "accent"
      | "success"
      | "warning"
      | "info"
      | "muted"
  ) => {
    switch (type) {
      case "primary":
        return {
          gradientClass: "bg-gradient-to-br from-primary to-primary/80",
          iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
        };
      case "secondary":
        return {
          gradientClass: "bg-gradient-to-br from-secondary to-secondary/80",
          iconBgClass: "bg-gradient-to-br from-secondary to-secondary/80",
        };
      case "accent":
        return {
          gradientClass: "bg-gradient-to-br from-accent to-accent/80",
          iconBgClass: "bg-gradient-to-br from-accent to-accent/80",
        };
      case "success":
        return {
          gradientClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
          iconBgClass: "bg-gradient-to-br from-emerald-500 to-emerald-600",
        };
      case "warning":
        return {
          gradientClass: "bg-gradient-to-br from-amber-500 to-amber-600",
          iconBgClass: "bg-gradient-to-br from-amber-500 to-amber-600",
        };
      case "info":
        return {
          gradientClass: "bg-gradient-to-br from-blue-500 to-blue-600",
          iconBgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
        };
      case "muted":
        return {
          gradientClass: "bg-gradient-to-br from-muted to-muted/80",
          iconBgClass: "bg-gradient-to-br from-muted to-muted/80",
        };
      default:
        return {
          gradientClass: "bg-gradient-to-br from-primary to-primary/80",
          iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
        };
    }
  };

  return { getColorScheme };
};
