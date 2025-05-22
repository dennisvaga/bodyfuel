"use client";

import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import { LayoutGrid, Package, ShoppingCart, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  orderService,
  productService,
  collectionService,
  QUERY_KEYS,
} from "@repo/shared";

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link href="/orders">
        <Card className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">{orderCount}</h3>
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/products">
        <Card className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Products</p>
              <h3 className="text-2xl font-bold">{productCount}</h3>
            </div>
          </div>
        </Card>
      </Link>

      <Link href="/collections">
        <Card className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Collections</p>
              <h3 className="text-2xl font-bold">{collectionCount}</h3>
            </div>
          </div>
        </Card>
      </Link>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Customers</p>
            <h3 className="text-2xl font-bold">-</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};
