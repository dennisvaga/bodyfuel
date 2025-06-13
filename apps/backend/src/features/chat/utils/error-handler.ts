/**
 * Centralized error handling utilities for the chat API
 */

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Create a validation error response
 */
export function createValidationErrorResponse(error: string): Response {
  return createErrorResponse(`Invalid request format: ${error}`, 400);
}

/**
 * Create a not found error response
 */
export function createNotFoundErrorResponse(
  message: string = "Resource not found"
): Response {
  return createErrorResponse(message, 404);
}

/**
 * Create an internal server error response
 */
export function createInternalErrorResponse(error: unknown): Response {
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return createErrorResponse(message, 500);
}

/**
 * Custom error classes for better error handling
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class StreamingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StreamingError";
  }
}
