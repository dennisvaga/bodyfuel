import { ChatRequestType } from "../types/apiTypes";
import { ErrorResponse } from "../types/apiTypes";

/**
 * Validate chat request and return parsed data or error response
 */
export function validateChatRequest(
  validationResult: any
): { success: true; data: ChatRequestType } | { success: false; response: Response } {
  if (!validationResult.success) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          error: "Invalid request",
          details: validationResult.error.errors,
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      ),
    };
  }
  
  return { success: true, data: validationResult.data };
}

/**
 * Validate that a message exists
 */
export function validateMessage(message: string): Response | null {
  if (!message) {
    return new Response(
      JSON.stringify({
        error: "Invalid request",
        message: "No message content provided",
      } as ErrorResponse),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return null;
}

/**
 * Create error response
 */
export function createErrorResponse(
  error: string,
  message: string,
  status: number = 500
): Response {
  return new Response(
    JSON.stringify({
      error,
      message,
    } as ErrorResponse),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
