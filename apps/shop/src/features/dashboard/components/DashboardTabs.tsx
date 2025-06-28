"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { Session } from "next-auth";
import { OrderWithItems } from "@repo/database/types/order";

import AccountDetailsCard from "./AccountDetailsCard";
import OrdersSummaryCard from "./OrdersSummaryCard";
import QuickActionsCard from "./QuickActionsCard";
import OrdersList from "./OrdersList";
import ProfileInfo from "./ProfileInfo";
import { OrdersListSkeleton } from "./DashboardSkeleton";

interface DashboardTabsProps {
  session: Session | null;
  orders: OrderWithItems[];
  isLoading?: boolean;
}

const DashboardTabs = ({
  session,
  orders,
  isLoading = false,
}: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AccountDetailsCard session={session} />
          <OrdersSummaryCard orders={orders} />
          <QuickActionsCard />
        </div>
      </TabsContent>

      <TabsContent value="orders">
        {isLoading ? <OrdersListSkeleton /> : <OrdersList orders={orders} />}
      </TabsContent>

      <TabsContent value="profile">
        <ProfileInfo session={session} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
