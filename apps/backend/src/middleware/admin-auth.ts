import { Request, Response, NextFunction } from "express";
import { sendResponse } from "#utils/api-response.js";
import { getSession } from "@auth/express";
import { getExpressAuthConfig } from "@repo/auth/express";

// Add a custom interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Admin authentication middleware using Auth.js Express
 *
 * This function:
 * 1. Uses Auth.js Express getSession to retrieve the session
 * 2. Validates that the user is authenticated
 * 3. Checks that the user has admin role
 * 4. Attaches user info to request for downstream use
 */
export async function authenticatedAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    // Get session using Auth.js Express
    const session = await getSession(req, getExpressAuthConfig());

    if (!session || !session.user) {
      sendResponse(res, 401, {
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Check if user is admin
    if ((session.user as any).role !== "ADMIN") {
      sendResponse(res, 403, {
        success: false,
        message: "Admin access required",
      });
      return;
    }

    // Attach user info to request for downstream use
    req.user = session.user;

    next();
  } catch (error) {
    sendResponse(res, 401, {
      success: false,
      message: "Invalid authentication",
    });
  }
}
