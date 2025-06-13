"use client";

import { Grid3x3, Package2, ShoppingBag, Users2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  orderService,
  productService,
  collectionService,
  QUERY_KEYS,
} from "@repo/shared";
import { DashboardCard } from "./DashboardCard";

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
      icon: ShoppingBag,
      title: "Total Orders",
      value: orderCount,
      color: "blue" as const,
    },
    {
      icon: Package2,
      title: "Products",
      value: productCount,
      color: "emerald" as const,
    },
    {
      icon: Grid3x3,
      title: "Collections",
      value: collectionCount,
      color: "purple" as const,
    },
    {
      icon: Users2,
      title: "Customers",
      value: "-",
      color: "primary" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4">
      {stats.map((stat, index) => (
        <DashboardCard key={index} {...stat} />
      ))}
    </div>
  );
};
