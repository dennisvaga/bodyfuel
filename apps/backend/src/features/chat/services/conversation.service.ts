import { ChatMessage } from "../chat.types.js";

// In-memory storage for conversations (persists until server restart)
const conversations = new Map<
  string,
  { id: string; messages: ChatMessage[] }
>();

/**
 * Handle conversation management
 * Creates a new conversation or retrieves an existing one
 *
 * @param conversationId Optional conversation ID
 * @param messages Array of messages
 * @returns A conversation object with ID and messages
 */
export function handleConversation(
  conversationId: string | undefined,
  messages: ChatMessage[]
): { id: string; messages: ChatMessage[] } {
  // If conversation ID is provided, try to retrieve the conversation
  if (conversationId && conversations.has(conversationId)) {
    const existingConversation = conversations.get(conversationId)!;

    // Update the existing conversation with new messages
    const updatedMessages = [...existingConversation.messages];

    // Add any new messages that aren't already in the conversation
    for (const message of messages) {
      // Check if this message is already in the conversation
      const messageExists = updatedMessages.some(
        (m) => m.content === message.content && m.role === message.role
      );

      if (!messageExists) {
        updatedMessages.push(message);
      }
    }

    const updatedConversation = {
      id: conversationId,
      messages: updatedMessages,
    };

    // Update the conversation in the map
    conversations.set(conversationId, updatedConversation);

    return updatedConversation;
  }

  // Create a new conversation
  const newConversationId = conversationId || `conv_${Date.now()}`;
  const newConversation = {
    id: newConversationId,
    messages,
  };

  // Store the new conversation
  conversations.set(newConversationId, newConversation);

  return newConversation;
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
