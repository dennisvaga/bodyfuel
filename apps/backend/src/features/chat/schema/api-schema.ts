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

/**
 * Chat response schema
 */
export const chatResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});

/**
 * Error response schema
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.string().optional(),
});
