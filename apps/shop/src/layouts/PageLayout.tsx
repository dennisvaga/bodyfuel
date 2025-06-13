"use client";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import LoadAnimation from "@repo/ui/components/LoadAnimation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

interface PageLayoutProps<T> {
  isLoading: boolean;
  data: T | undefined | null;
  children: (data: T) => ReactNode;
  loadingComponent?: ReactNode;
  notFoundComponent?: ReactNode;
  containerClassName?: string;
}

/**
 * Reusable page layout component that handles loading and not-found states.
 * Eliminates the need to repeat loading/error handling logic across pages.
 */
function PageLayout<T>({
  isLoading,
  data,
  children,
  loadingComponent,
  notFoundComponent,
  containerClassName,
}: PageLayoutProps<T>) {
  // Show loading state
  if (isLoading) {
    return (
      <SectionContainer
        className={`flex justify-center ${containerClassName || ""}`}
      >
        {loadingComponent || <LoadAnimation />}
      </SectionContainer>
    );
  }

  // Show not found if no data
  if (!data) {
    if (notFoundComponent) {
      return <>{notFoundComponent}</>;
    }
    return notFound();
  }

  // Render children with data
  return <>{children(data)}</>;
}

export default PageLayout;
