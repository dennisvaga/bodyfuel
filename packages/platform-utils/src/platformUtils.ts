/**
 * Platform utilities for handling different environments
 */

// Storage key for platform override
const PLATFORM_OVERRIDE_KEY = "platform_override";

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

  // Check for platform override (for testing)
  const override = localStorage.getItem(PLATFORM_OVERRIDE_KEY);
  if (
    override &&
    (override === "android" || override === "ios" || override === "browser")
  ) {
    return override as PlatformType;
  }

  // Detect Android
  if (/Android/i.test(window.navigator.userAgent)) {
    return "android";
  }

  // Detect iOS
  if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
    return "ios";
  }

  // Default to browser
  return "browser";
};

/**
 * Set a platform override for testing
 * @param platform The platform to simulate
 */
export const setPlatformOverride = (platform: PlatformType | null): void => {
  if (typeof window === "undefined") return;

  if (platform) {
    localStorage.setItem(PLATFORM_OVERRIDE_KEY, platform);
  } else {
    localStorage.removeItem(PLATFORM_OVERRIDE_KEY);
  }
};

/**
 * Clear any platform override
 */
export const clearPlatformOverride = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PLATFORM_OVERRIDE_KEY);
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
 * @param defaultUrl The default URL from environment variables
 * @returns The URL with the correct host for the current platform
 */
export const getPlatformAwareUrl = (defaultUrl: string): string => {
  // If we don't have a default URL, return it
  if (!defaultUrl) {
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

    return url.toString();
  } catch (error) {
    // If there's an error parsing the URL, return the original
    console.error("Error parsing URL:", error);
    return defaultUrl;
  }
};
