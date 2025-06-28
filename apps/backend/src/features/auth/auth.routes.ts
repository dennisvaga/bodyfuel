import express, { Router } from "express";
import authController from "./auth.controller.js";

const router: Router = express.Router();

// User signup
router.post("/signup", authController.signup.bind(authController));

// User signin
router.post("/signin", authController.signin.bind(authController));

export default router;
