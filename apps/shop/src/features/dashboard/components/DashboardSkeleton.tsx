"use client";

import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSkeleton } from "@repo/ui/hooks/useSkeleton";

/**
 * Skeleton loading component for dashboard cards
 */
const DashboardCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton height={20} width={128} />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="75%" />
        <Skeleton height={16} width="50%" />
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
        <Skeleton height={20} width={112} />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton height={32} width="100%" />
        <Skeleton height={32} width="100%" />
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
        <Skeleton height={20} width={96} />
        <Skeleton height={16} width={192} />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="space-y-2">
                <Skeleton height={16} width={128} />
                <Skeleton height={12} width={96} />
              </div>
              <Skeleton height={24} width={64} className="rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton height={16} width={80} />
              <Skeleton height={16} width={64} />
            </div>
            <Skeleton height={32} width={96} className="mt-2" />
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
  const { skeletonTheme } = useSkeleton();

  return (
    <SkeletonTheme {...skeletonTheme}>
      <div className="w-full space-y-4">
        {/* Tabs skeleton */}
        <div className="flex space-x-2 mb-4">
          <Skeleton height={36} width={80} />
          <Skeleton height={36} width={64} />
          <Skeleton height={36} width={64} />
        </div>

        {/* Overview tab content skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <QuickActionsCardSkeleton />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export { DashboardCardSkeleton, QuickActionsCardSkeleton, OrdersListSkeleton };
