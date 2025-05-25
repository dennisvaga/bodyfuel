"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect mobile keyboard visibility and height
 * Uses the VisualViewport API with fallback to a simpler approach
 *
 * @returns An object containing:
 * - keyboardHeight: estimated height of the keyboard in pixels
 * - isKeyboardVisible: boolean indicating if keyboard is visible
 * - keyboardPercentage: keyboard height as percentage of screen height
 */
export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Use VisualViewport API if available (modern browsers)
    if (window.visualViewport) {
      const handleResize = () => {
        // Calculate keyboard height (difference between layout height and visual height)
        const layoutHeight = window.innerHeight;
        const visualHeight = window.visualViewport.height;
        const calculatedKeyboardHeight = layoutHeight - visualHeight;

        // Use a threshold to avoid false positives
        if (calculatedKeyboardHeight > 60) {
          setKeyboardHeight(calculatedKeyboardHeight);
        } else {
          setKeyboardHeight(0);
        }
      };

      // Listen for viewport changes
      window.visualViewport.addEventListener("resize", handleResize);

      // Initial check
      handleResize();

      // Cleanup
      return () =>
        window.visualViewport.removeEventListener("resize", handleResize);
    }

    // Fallback for browsers without VisualViewport API
    return undefined;
  }, []);

  // Derived values
  const isKeyboardVisible = keyboardHeight > 0;
  const keyboardPercentage =
    typeof window !== "undefined"
      ? Math.round((keyboardHeight / window.innerHeight) * 100)
      : 0;

  return {
    keyboardHeight,
    isKeyboardVisible,
    keyboardPercentage,
  };
}
