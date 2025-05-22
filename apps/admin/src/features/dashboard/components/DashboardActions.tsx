"use client";

import { Card } from "@repo/ui/components/ui/card";
import Link from "next/link";
import { LayoutGrid, Plus, ListOrdered } from "lucide-react";

export const DashboardActions = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/products/new">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <div>
                <h5 className="font-medium">Add New Product</h5>
                <p className="text-sm text-muted-foreground">
                  Create and publish a new product
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/orders">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center space-x-2">
              <ListOrdered className="h-5 w-5" />
              <div>
                <h5 className="font-medium">View Orders</h5>
                <p className="text-sm text-muted-foreground">
                  Check your recent orders
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/collections">
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-center space-x-2">
              <LayoutGrid className="h-5 w-5" />
              <div>
                <h5 className="font-medium">Manage Collections</h5>
                <p className="text-sm text-muted-foreground">
                  Organize your products
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}; 