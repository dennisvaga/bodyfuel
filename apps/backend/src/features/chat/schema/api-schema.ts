import { z } from "zod";

/**
 * Chat message schema for API validation
 */
export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

/**
 * Chat request schema for API validation
 */
export const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z.array(chatMessageSchema),
});
