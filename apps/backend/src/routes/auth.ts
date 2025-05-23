import { prisma } from "@repo/database";
import express, { Request, Response, Router } from "express";
import { handleError } from "../utils/handleErrors.js";
import bcrypt from "bcryptjs";
import { sendResponse } from "../utils/apiResponse.js";

const router: Router = express.Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1) Validate request data
    if (!name || !email || !password) {
      sendResponse(res, 400, {
        success: false,
        message: "All fields are required.",
      });
      return;
    }

    // 2) Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      sendResponse(res, 409, {
        success: false,
        message: "User already exists.",
      });
      return;
    }

    // 3) Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Create new user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Store the hashed password
        role: "USER", // Default role (can be changed based on your needs)
      },
    });

    // 5) Send success response
    sendResponse(res, 201, {
      success: true,
      message: "User created successfully!",
      data: newUser,
    });
  } catch (err) {
    handleError(err, res);
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      sendResponse(res, 404, {
        success: false,
        message: "No user found or password not set.",
      });
      return;
    }

    const isValid = await bcrypt.compare(password, user?.password ?? "");

    if (!isValid) {
      sendResponse(res, 401, { success: false, message: "Invalid password." });
      return;
    }

    sendResponse(res, 200, { success: true, data: user });
    // res.status(201).json(user);
  } catch (err) {
    handleError(err, res);
  }
});

export default router;
