import { ZodError } from "zod";
import { Response } from "express";
import type { ApiResult } from "@repo/shared";
import { sendResponse } from "#utils/api-response.js";
import { Prisma } from "@prisma/client";

export const handleError = (
  error: any,
  res: Response,
  isAdmin: boolean = false
): Response<ApiResult> => {
  // Log all errors for debugging purposes
  console.error("Error occurred:", error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errorMessage = error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    return sendResponse(res, 400, { success: false, message: errorMessage });
  }
  // Handle Prisma database errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError && isAdmin) {
    // For admin users: show the actual error message with code
    const detailedMessage = `Database error (${error.code}): ${error.message}`;
    return sendResponse(res, getStatusCode(error), {
      success: false,
      message: detailedMessage,
    });
  }
  // Handle other types of errors
  else {
    const message = isAdmin
      ? error.message || "An unexpected error occurred."
      : "An unexpected error occurred. Please try again later.";

    return sendResponse(res, 500, { success: false, message });
  }
};

// Helper function to determine status code
function getStatusCode(error: Prisma.PrismaClientKnownRequestError): number {
  return error.code === "P2025" ? 404 : 400;
}
