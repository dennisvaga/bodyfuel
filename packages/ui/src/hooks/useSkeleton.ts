/**
 * Custom hook that provides consistent skeleton theme for all skeleton components
 * Uses CSS variables that automatically adapt to light/dark mode
 */
export const useSkeleton = () => {
  const skeletonTheme = {
    baseColor: "hsl(var(--muted))",
    highlightColor: "hsl(var(--muted-foreground) / 0.1)",
  };

  return { skeletonTheme };
};
