import { Request, Response, NextFunction } from "express";
import { sendResponse } from "@utils/api-response.js";
import { decryptToken } from "../utils/auth-utils.js";

// Add a custom interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Decrypts the session token.
 *
 * This function:
 * 1. Determines the correct cookie name based on environment (using __Secure- prefix in production)
 * 2. Extracts the encrypted session token from the provided token string
 * 3. Decrypts the token using the application's secret key
 * 4. Returns the decoded JWT payload containing user identification data
 *
 */
export async function authenticatedAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get the token from cookies
    const token = req.cookies["authjs.session-token"];

    if (!token) {
      sendResponse(res, 401, {
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const isDev = process.env.NODE_ENV !== "production";

    // Decrypt the token
    const payload = await decryptToken(token, isDev);

    if (!payload) {
      sendResponse(res, 401, { success: false, message: "Invalid token" });
      return;
    }

    // Check if user is admin
    if (
      typeof payload !== "object" ||
      !("role" in payload) ||
      payload.role !== "ADMIN"
    ) {
      sendResponse(res, 403, {
        success: false,
        message: "Admin access required",
      });
      return;
    }

    // Attach user info to request for downstream use
    req.user = payload;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    sendResponse(res, 401, {
      success: false,
      message: "Invalid authentication",
    });
  }
}
