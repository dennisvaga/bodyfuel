"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@repo/ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../features/cart/contexts/cartContext";
import { ThemeProvider } from "@repo/ui/components/theme-provider";
const AppProviders = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>{children}</TooltipProvider>
          </ThemeProvider>
        </CartProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppProviders;
