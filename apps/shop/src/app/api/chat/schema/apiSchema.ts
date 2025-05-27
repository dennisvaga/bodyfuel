import { z } from "zod";

/**
 * Chat message schema
 */
export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

/**
 * Chat request schema - supports both single message and messages array
 */
export const chatRequestSchema = z
  .object({
    conversationId: z.string().optional(),
    message: z.string().optional(), // Single message for new conversations
    messages: z.array(chatMessageSchema).optional(), // Message history
  })
  .refine(
    (data) => data.message || (data.messages && data.messages.length > 0),
    {
      message: "Either message or messages must be provided",
    }
  );

export type ChatRequestType = z.infer<typeof chatRequestSchema>;
export type ChatMessageType = z.infer<typeof chatMessageSchema>;

/**
 * API Response types
 */
export type ErrorResponse = {
  error: string;
  message?: string;
  details?: any;
};

export type SuccessResponse = {
  message: string;
  data?: any;
};
