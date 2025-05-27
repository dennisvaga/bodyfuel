import express, { Router } from "express";
import chatController from "./chat.controller.js";

const router: Router = express.Router();

// Handle chat messages with streaming response
router.post("/", async (req, res) => {
  await chatController.handleChat(req, res);
});

export default router;
