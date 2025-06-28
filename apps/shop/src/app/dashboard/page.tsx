"use client";

import { useSession } from "next-auth/react";
import DashboardTabs from "@/src/features/dashboard/components/DashboardTabs";
import { DashboardSkeleton } from "@/src/features/dashboard/components/DashboardSkeleton";
import { orderService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import PageLayout from "@/src/layouts/PageLayout";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useFetchQuery({
    queryKey: [QUERY_KEYS.USER_ORDERS, session?.user?.email],
    serviceFn: orderService.getUserOrders,
    options: {
      enabled: !!session?.user?.email, // Only fetch when user is authenticated
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    },
  });

  const isSessionLoading = status === "loading";
  const combinedLoading = isSessionLoading || isLoading;

  return (
    <PageLayout
      data={orders}
      isLoading={combinedLoading}
      requiresEntity={false}
    >
      {(ordersData, loading) => (
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl font-bold">Your Account</h1>
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <DashboardTabs
              session={session}
              orders={ordersData || []}
              isLoading={loading}
            />
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardPage;
