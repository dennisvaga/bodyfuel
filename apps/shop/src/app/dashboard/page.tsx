"use client";

import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

import DashboardTabs from "@/src/features/dashboard/components/DashboardTabs";
import { useUserOrders } from "@/src/features/dashboard/hooks/useUserOrders";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { orders, isLoading } = useUserOrders(session);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <section className="layout flex flex-col gap-8">
      <h1 className="text-4xl font-bold">Your Account</h1>

      <DashboardTabs session={session} orders={orders} />

      <div className="mt-8"></div>
    </section>
  );
};

export default DashboardPage;
