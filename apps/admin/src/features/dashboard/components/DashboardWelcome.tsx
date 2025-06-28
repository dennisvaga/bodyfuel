"use client";

import { useSession } from "next-auth/react";

export const DashboardWelcome = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin";

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName} 👋</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your store today
        </p>
      </div>
    </div>
  );
}; 