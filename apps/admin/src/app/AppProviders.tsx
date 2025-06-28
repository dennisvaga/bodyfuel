"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppProviders;
