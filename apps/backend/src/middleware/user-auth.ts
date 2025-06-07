import { Request, Response, NextFunction } from "express";
import { sendResponse } from "#utils/api-response.js";
import { decryptToken } from "../utils/auth-utils.js";

// Add a custom interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * User authentication middleware for regular users (not admin-specific)
 *
 * This function:
 * 1. Extracts the session token from cookies
 * 2. Decrypts and validates the token
 * 3. Allows access to authenticated users (any role)
 * 4. Attaches user info to request for downstream use
 */
export async function authenticatedUser(
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

    // Check if payload is valid (any authenticated user)
    if (typeof payload !== "object" || !("email" in payload)) {
      sendResponse(res, 401, {
        success: false,
        message: "Invalid token format",
      });
      return;
    }

    // Attach user info to request for downstream use
    req.user = payload;

    next();
  } catch (error) {
    console.error("User authentication error:", error);
    sendResponse(res, 401, {
      success: false,
      message: "Invalid authentication",
    });
  }
}
