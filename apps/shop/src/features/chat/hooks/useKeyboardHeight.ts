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
  const [lastInnerHeight, setLastInnerHeight] = useState(0);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Set initial window height
    setLastInnerHeight(window.innerHeight);

    // Use VisualViewport API if available (modern browsers)
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      const handleResize = () => {
        // Calculate keyboard height (difference between layout height and visual height)
        const layoutHeight = window.innerHeight;
        const visualHeight = visualViewport.height;
        const calculatedKeyboardHeight = layoutHeight - visualHeight;

        // Use a threshold to avoid false positives
        if (calculatedKeyboardHeight > 60) {
          setKeyboardHeight(calculatedKeyboardHeight);
        } else {
          setKeyboardHeight(0);
        }
      };

      // Listen for viewport changes
      visualViewport.addEventListener("resize", handleResize);
      visualViewport.addEventListener("scroll", handleResize);

      // Initial check
      handleResize();

      // Cleanup
      return () => {
        visualViewport.removeEventListener("resize", handleResize);
        visualViewport.removeEventListener("scroll", handleResize);
      };
    } else {
      // Fallback for browsers without VisualViewport API
      const handleResize = () => {
        // If the window height is significantly smaller than the last recorded height,
        // we can assume the keyboard is visible
        if (lastInnerHeight && window.innerHeight < lastInnerHeight * 0.75) {
          setKeyboardHeight(lastInnerHeight - window.innerHeight);
        } else {
          setLastInnerHeight(window.innerHeight);
          setKeyboardHeight(0);
        }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [lastInnerHeight]);

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
