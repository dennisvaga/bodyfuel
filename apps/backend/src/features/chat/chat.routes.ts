import express, { Router } from "express";
import chatController from "./chat.controller.js";

const router: Router = express.Router();

// Process chat messages and generate AI responses
router.post("/", chatController.processChat.bind(chatController));

// Debug endpoints
router.get(
  "/debug/conversations",
  chatController.debugConversations.bind(chatController)
);
router.get(
  "/debug/conversation/:conversationId",
  chatController.getConversation.bind(chatController)
);

export default router;
