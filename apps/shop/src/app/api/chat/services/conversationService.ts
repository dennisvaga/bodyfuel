import { ChatMessage, Conversation } from "../types/chat.types.js";
import * as chatRepository from "../repositories/chatRepository.js";

/**
 * Handle conversation management
 * Creates a new conversation or retrieves an existing one
 *
 * @param conversationId Optional conversation ID
 * @param messages Array of messages
 * @returns A conversation object with ID and messages
 */
export async function handleConversation(
  conversationId: string | undefined,
  messages: ChatMessage[]
): Promise<Conversation> {
  // If conversation ID is provided, try to retrieve the conversation
  if (conversationId) {
    const existingConversation =
      await chatRepository.getConversationById(conversationId);

    if (existingConversation) {
      return existingConversation as Conversation;
    }
  }

  // Create a new conversation
  const newConversation = await chatRepository.createConversation(messages);
  return newConversation as Conversation;
}

/**
 * Get the latest user message from an array of messages
 *
 * @param messages Array of messages
 * @returns The latest user message or null if none found
 */
export function getLatestUserMessage(
  messages: ChatMessage[]
): ChatMessage | null {
  // Iterate backwards through messages to find the latest user message
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return messages[i];
    }
  }

  return null;
}

/**
 * Limit messages to a reasonable number for context
 *
 * @param messages Array of messages
 * @param limit Maximum number of messages to include
 * @returns Limited array of messages
 */
export function limitMessagesForContext(
  messages: ChatMessage[],
  limit: number = 5
): ChatMessage[] {
  // If we have fewer messages than the limit, return all messages
  if (messages.length <= limit) {
    return messages;
  }

  // Otherwise, return the most recent messages up to the limit
  return messages.slice(-limit);
}

/**
 * Add a system message to the beginning of the messages array
 *
 * @param messages Array of messages
 * @param systemMessage System message content
 * @returns Array of messages with system message at the beginning
 */
export function addSystemMessage(
  messages: ChatMessage[],
  systemMessage: string
): ChatMessage[] {
  // Create a copy of the messages array
  const messagesWithSystem = [...messages];

  // Add the system message at the beginning
  messagesWithSystem.unshift({
    role: "system",
    content: systemMessage,
  });

  return messagesWithSystem;
}

/**
 * Add an assistant message to the messages array
 *
 * @param messages Array of messages
 * @param assistantMessage Assistant message content
 * @returns Array of messages with assistant message at the end
 */
export function addAssistantMessage(
  messages: ChatMessage[],
  assistantMessage: string
): ChatMessage[] {
  // Create a copy of the messages array
  const messagesWithAssistant = [...messages];

  // Add the assistant message at the end
  messagesWithAssistant.push({
    role: "assistant",
    content: assistantMessage,
  });

  return messagesWithAssistant;
}
