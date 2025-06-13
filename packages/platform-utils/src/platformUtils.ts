/**
 * Platform utilities for handling different environments
 * This is only for debugging purposes
 */
// Platform types
export type PlatformType = "browser" | "android" | "ios";

/**
 * Detects the current platform
 * @returns The detected platform type
 */
export const detectPlatform = (): PlatformType => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return "browser"; // Default for server-side rendering
  }

  // Check if we're in a real mobile app (React Native, Capacitor, etc.)
  // These environments typically don't have certain browser-specific APIs
  const isActualMobileApp =
    // React Native doesn't have document
    typeof document === "undefined" ||
    // Capacitor apps have this global
    !!(window as any).Capacitor ||
    // Cordova apps have this global
    !!(window as any).cordova ||
    // Check if we're in a WebView that's not a browser
    (window.navigator.userAgent.includes("wv") &&
      (window.navigator.userAgent.includes("Android") ||
        window.navigator.userAgent.includes("iPhone")));

  // If we're in a browser (even with mobile emulation), return browser
  if (!isActualMobileApp) {
    return "browser";
  }

  // Only check for actual mobile platforms if we're in a real mobile app
  if (/Android/i.test(window.navigator.userAgent)) {
    return "android";
  }

  if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
    return "ios";
  }

  // Default to browser
  return "browser";
};

/**
 * Determines the base URL for API calls based on the running platform
 * - Uses localhost for browser development
 * - Uses 10.0.2.2 for Android emulator (which maps to host machine's localhost)
 * - Can be extended for iOS simulator or production environments
 */
export const getApiBaseUrl = (port: number = 5001): string => {
  const platform = detectPlatform();

  switch (platform) {
    case "android":
      return `http://10.0.2.2:${port}`;
    case "ios":
      // For iOS simulator, localhost works but can be customized if needed
      return `http://localhost:${port}`;
    default:
      return `http://localhost:${port}`;
  }
};

/**
 * Gets the appropriate API URL with the correct host for the current platform
 *
 * IMPORTANT: baseUrl ends with a slash
 * @param defaultUrl The default URL from environment variables
 * @returns The URL with the correct host for_ the current platform
 */
export const getPlatformAwareUrl = (defaultUrl: string): string => {
  const isprod = process.env.NODE_ENV === "production";

  // If we're in production or the default URL is not set, return the default URL
  if (isprod || !defaultUrl) {
    return defaultUrl;
  }

  try {
    // Parse the default URL
    const url = new URL(defaultUrl);
    const platform = detectPlatform();

    if (platform === "android" && url.hostname === "localhost") {
      // Replace localhost with 10.0.2.2 for Android
      url.hostname = "10.0.2.2";
    }

    // Remove trailing slash from final URL
    return url.toString().replace(/\/$/, "");
  } catch (error) {
    // If there's an error parsing the URL, return the original
    console.error("Error parsing URL:", error);
    return defaultUrl;
  }
};
