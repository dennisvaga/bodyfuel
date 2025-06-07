"use client";

import { useSession } from "next-auth/react";
import LoadAnimation from "@repo/ui/components/LoadAnimation";

import DashboardTabs from "@/src/features/dashboard/components/DashboardTabs";

import { orderService, QUERY_KEYS, useFetchQuery } from "@repo/shared";
import { Session } from "next-auth";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

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
  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadAnimation />
      </div>
    );
  }

  return (
    <SectionContainer className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Your Account</h1>

      <DashboardTabs session={session} orders={orders} />

      <div className="mt-8"></div>
    </SectionContainer>
  );
};

export default DashboardPage;
