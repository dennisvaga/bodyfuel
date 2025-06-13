"use client";

import React from "react";
import { DashboardStats } from "@/src/features/dashboard/components/DashboardStats";
import { DashboardActions } from "@/src/features/dashboard/components/DashboardActions";
import { DashboardWelcome } from "@/src/features/dashboard/components/DashboardWelcome";

const DashboardPage = () => {
  return (
    <div className="p-6 space-y-6">
      <DashboardWelcome />
      <DashboardStats />
      <DashboardActions />
    </div>
  );
};

export default DashboardPage;
