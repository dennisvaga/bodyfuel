"use client";

import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

/**
 * Skeleton loading component for dashboard cards
 */
const DashboardCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton loading component for the quick actions card
 */
const QuickActionsCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </CardContent>
    </Card>
  );
};

/**
 * Skeleton loading component for the orders list
 */
const OrdersListSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-24 mt-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

/**
 * Complete dashboard skeleton with all tabs
 */
export const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      {/* Tabs skeleton */}
      <div className="flex space-x-2 mb-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="h-9 w-16" />
      </div>

      {/* Overview tab content skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <QuickActionsCardSkeleton />
      </div>
    </div>
  );
};

export { DashboardCardSkeleton, QuickActionsCardSkeleton, OrdersListSkeleton };
