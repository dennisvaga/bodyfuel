"use client";

import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SectionContainer } from "@repo/ui/components/SectionContainer";

interface PageLayoutProps<T> {
  data: T | undefined | null;
  isLoading?: boolean;
  children: (data: T, isLoading: boolean) => ReactNode;
  notFoundComponent?: ReactNode;
  containerClassName?: string;
  requiresEntity?: boolean;
  className?: string; // Optional className for additional styling
}

/**
 * Unified PageLayout component for all pages with proper semantic HTML structure.
 *
 * Features:
 * - Wraps content in <main> for accessibility
 * - Handles loading states consistently
 * - Supports both entity pages (that require entities) and standard pages
 * - Provides consistent SectionContainer wrapper
 *
 * @param requiresEntity - Whether this page requires an entity to exist
 *   - true: Entity pages (products, collections) - shows 404 if data is null
 *   - false: Standard pages (cart, dashboard) - always renders, data can be null/empty
 */
function PageLayout<T>({
  data,
  isLoading = false,
  children,
  notFoundComponent,
  containerClassName,
  requiresEntity = true, // Default to true for backward compatibility
  className = "",
}: PageLayoutProps<T>) {
  // During loading, render children with undefined data - they handle loading states
  if (isLoading) {
    return (
      <main>
        <SectionContainer className={containerClassName}>
          {children(undefined as T, isLoading)}
        </SectionContainer>
      </main>
    );
  }

  // Only show not found for entity pages when data doesn't exist
  if (requiresEntity && !data) {
    if (notFoundComponent) {
      return <>{notFoundComponent}</>;
    }
    return notFound();
  }

  // Render children with data (or null for standard pages)
  return (
    <main className={className}>
      <SectionContainer className={containerClassName}>
        {children(data as T, isLoading)}
      </SectionContainer>
    </main>
  );
}

export default PageLayout;
