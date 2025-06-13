import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Custom hook that provides the appropriate logo based on the current theme
 * Handles mounting state to avoid hydration mismatches
 */
export const useThemeAwareLogo = (
  brightLogoPath: string,
  darkLogoPath: string
) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to display based on the current theme
  const logoSrc =
    mounted && (theme === "dark" || resolvedTheme === "dark")
      ? darkLogoPath
      : brightLogoPath;

  return { logoSrc, mounted };
};
