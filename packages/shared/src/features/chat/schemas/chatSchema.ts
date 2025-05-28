import { z } from "zod";

/**
 * Schema for validating chat messages
 */
export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1, "Message content is required"),
});

/**
 * Schema for validating chat requests
 */
export const chatRequestSchema = z.object({
  conversationId: z.string().optional(),
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required"),
});
