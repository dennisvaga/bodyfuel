import { Request, Response } from "express";
import authService from "./auth.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Auth controller responsible for handling HTTP requests related to authentication
 */
export class AuthController {
  /**
   * Handle user signup
   */
  async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const newUser = await authService.signup(name, email, password);

      sendResponse(res, 201, {
        success: true,
        message: "User created successfully!",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "User already exists.") {
        sendResponse(res, 409, {
          success: false,
          message: error.message,
        });
        return;
      }

      if (
        error instanceof Error &&
        error.message === "All fields are required."
      ) {
        sendResponse(res, 400, {
          success: false,
          message: error.message,
        });
        return;
      }

      handleError(error, res);
    }
  }

  /**
   * Handle user signin
   */
  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await authService.signin(email, password);

      sendResponse(res, 200, { success: true, data: user });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "No user found or password not set."
      ) {
        sendResponse(res, 401, {
          success: false,
          message: error.message,
        });
        return;
      }

      if (error instanceof Error && error.message === "Invalid password.") {
        sendResponse(res, 401, {
          success: false,
          message: error.message,
        });
        return;
      }

      handleError(error, res);
    }
  }
}

export default new AuthController();
