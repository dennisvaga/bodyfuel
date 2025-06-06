"use client";

import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import {
  Grid3x3,
  Package2,
  ShoppingBag,
  Users2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  orderService,
  productService,
  collectionService,
  QUERY_KEYS,
} from "@repo/shared";

const StatCard = ({
  href,
  icon: Icon,
  title,
  value,
  trend,
  gradientClass,
  iconBgClass,
}: {
  href?: string;
  icon: any;
  title: string;
  value: string | number;
  trend?: string;
  gradientClass: string;
  iconBgClass: string;
}) => {
  const CardContent = (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
    >
      {/* Background gradient overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 ${gradientClass}`}
      />

      <div className="p-6 relative">
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
              </div>
            </div>
          </div>
        </div>
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

export const DashboardStats = () => {
  // Fetch data for statistics using the correct service methods
  const { data: ordersData } = useQuery({
    queryKey: QUERY_KEYS.ORDERS,
    queryFn: orderService.getAllOrders,
  });

  const { data: productsData } = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS,
    queryFn: () => productService.getProducts({ getAllProducts: true }),
  });

  const { data: collectionsData } = useQuery({
    queryKey: QUERY_KEYS.COLLECTIONS,
    queryFn: () => collectionService.getCollections(),
  });

  // Get the counts
  const orderCount = ordersData?.data?.length ?? 0;
  const productCount = productsData?.data?.length ?? 0;
  const collectionCount = collectionsData?.data?.length ?? 0;

  const stats = [
    {
      href: "/orders",
      icon: ShoppingBag,
      title: "Total Orders",
      value: orderCount,
      gradientClass: "bg-gradient-to-br from-primary to-primary/80",
      iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      href: "/products",
      icon: Package2,
      title: "Products",
      value: productCount,
      gradientClass: "bg-gradient-to-br from-primary to-primary/80",
      iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      href: "/collections",
      icon: Grid3x3,
      title: "Collections",
      value: collectionCount,
      gradientClass: "bg-gradient-to-br from-primary to-primary/80",
      iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
    },
    {
      icon: Users2,
      title: "Customers",
      value: "-",
      gradientClass: "bg-gradient-to-br from-primary to-primary/80",
      iconBgClass: "bg-gradient-to-br from-primary to-primary/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
