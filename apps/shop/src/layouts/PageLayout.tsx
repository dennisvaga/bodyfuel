"use client";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

interface PageLayoutProps<T> {
  data: T | undefined | null;
  isLoading?: boolean;
  children: (data: T) => ReactNode;
  notFoundComponent?: ReactNode;
  containerClassName?: string;
}

/**
 * Reusable page layout component that handles loading and not-found states.
 * Components handle their own loading states with skeletons.
 * Errors are handled by Next.js error boundaries.
 */
function PageLayout<T>({
  data,
  isLoading = false,
  children,
  notFoundComponent,
  containerClassName,
}: PageLayoutProps<T>) {
  // During loading, let child components handle their own loading states
  if (isLoading) {
    return (
      <SectionContainer className={containerClassName}>
        {children(data as T)}
      </SectionContainer>
    );
  }

  // Only show not found when we're sure data doesn't exist (not loading + no data)
  if (!data) {
    if (notFoundComponent) {
      return <>{notFoundComponent}</>;
    }
    return notFound();
  }

  // Render children with data
  return (
    <SectionContainer className={containerClassName}>
      {children(data)}
    </SectionContainer>
  );
}

export default PageLayout;
