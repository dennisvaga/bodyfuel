import { Request, Response, NextFunction } from "express";
import { sendResponse } from "#utils/api-response.js";
import { getSession } from "@auth/express";
import { getExpressAuthConfig } from "@repo/auth/express";

// Add a custom interface to extend Express Request
interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * User authentication middleware using Auth.js Express
 *
 * This function:
 * 1. Uses Auth.js Express getSession to retrieve the session
 * 2. Validates that the user is authenticated
 * 3. Allows access to authenticated users (any role)
 * 4. Attaches user info to request for downstream use
 */
export async function authenticatedUser(
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

    // Check if user has email (basic validation for authenticated user)
    if (!session.user.email) {
      sendResponse(res, 401, {
        success: false,
        message: "Invalid session format",
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
