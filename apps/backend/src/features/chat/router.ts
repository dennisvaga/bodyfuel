import express from "express";
import * as chatController from "./controllers/chatController.js";

const router = express.Router();

/**
 * POST /chat - Process new chat messages and generate AI responses
 */
router.post("/", chatController.processChat);

export default router;
