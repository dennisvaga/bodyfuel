import { z } from "zod";

/**
 * Schema for validating chat messages
 */
export const chatMessageSchema = z.object({
  id: z.string().optional(), // Add optional id for existing messages
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1, "Message content is required"),
});

/**
 * Schema for validating chat requests
 */
export const chatRequestSchema = z.object({
  conversationId: z.string().optional(), // Add optional conversationId
  messages: z.array(chatMessageSchema).min(1, "At least one message is required"),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
