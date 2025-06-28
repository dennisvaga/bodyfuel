import type { ApiResult } from "#types/api";
import { ContentType, FetchMethod } from "#types/enums";
import { getPlatformAwareUrl } from "@repo/platform-utils";

interface Props {
  slug: string;
  method?: FetchMethod;
  body?: any;
  cache?: RequestCache;
  contentType?: ContentType;
  headers?: Record<string, string>;
}

interface StreamingProps {
  slug: string;
  method?: FetchMethod;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Fetching data using HTTP methods (GET, POST, PUT, DELETE)
 * Note: This apiClient work only internally, because it expect our return type of ApiResult
 * This API doesn't throw errors, providing full control over response handling.
 * Example: In signUp we check response.success and show toast.
 * In data fetching scenarios, we wrap this to throw errors when needed.
 *
 * @returns ApiResult containing success, message, and data
 */
export const fetchData = async ({
  slug, // for use internally
  method = FetchMethod.GET,
  body = null,
  cache = "default",
  contentType = ContentType.NONE,
  headers: customHeaders = {},
}: Props): Promise<ApiResult> => {
  const headers: HeadersInit = { ...customHeaders };

  if (contentType !== ContentType.NONE) {
    headers["Content-Type"] = contentType;
  }

  // Check if env loaded correctly
  if (!process.env.NEXT_PUBLIC_BACKEND_API) {
    throw new Error("NEXT_PUBLIC_BACKEND_API is not defined");
  }

  // Get platform-aware URL that handles Android emulator
  const baseUrl = getPlatformAwareUrl(process.env.NEXT_PUBLIC_BACKEND_API);

  const response = await fetch(`${baseUrl}/api/${slug}`, {
    method: method,
    body: body,
    credentials: "include", // Allow cookies
    headers,
    cache: cache,
  });

  // Parse JSON safely
  let result: ApiResult;
  try {
    result = (await response.json()) as ApiResult;
  } catch (err) {
    return { success: false, message: "Failed to parse server response." };
  }

  // If response is not OK (.e.g 4xx status), return the message from the API
  if (!response.ok) {
    return {
      success: false,
      message:
        result.message || `Error ${response.status}: ${response.statusText}`,
      statusCode: response.status,
    };
  }

  // This will return ApiResult
  return result;
};

/**
 * Fetching streaming data using HTTP methods (GET, POST)
 * This function is specifically designed for streaming responses like Server-Sent Events (SSE)
 * Unlike fetchData, it returns the raw Response object without attempting to parse it as JSON
 *
 * @returns Raw Response object that can be used with a reader for streaming
 */
export const fetchStreamingData = async ({
  slug,
  method = FetchMethod.GET,
  body = null,
  headers: customHeaders = {},
}: StreamingProps): Promise<Response> => {
  const headers: HeadersInit = {
    ...customHeaders,
    Accept: "text/event-stream",
  };

  // Check if env loaded correctly
  if (!process.env.NEXT_PUBLIC_BACKEND_API)
    throw new Error("NEXT_PUBLIC_BACKEND_API is not defined");

  // Get platform-aware URL that handles Android emulator
  const baseUrl = getPlatformAwareUrl(process.env.NEXT_PUBLIC_BACKEND_API);

  // Return the raw response without parsing it
  return fetch(`${baseUrl}api/${slug}`, {
    method: method,
    body: body,
    credentials: "include", // Allow cookies
    headers,
    cache: "no-store", // Don't cache streaming responses
  });
};
