import { ChatMessage } from "@repo/shared";

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
      // Improved duplicate checking - use timestamp or add unique ID
      const messageExists = updatedMessages.some(
        (m) =>
          m.content === message.content &&
          m.role === message.role &&
          // For assistant messages with HTML, be more lenient on duplicates
          (m.role !== "assistant" || m.content.length < 100)
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
 * Add a single message to an existing conversation
 */
export function addMessage(conversationId: string, message: ChatMessage): void {
  console.log(
    `addMessage called with conversationId: ${conversationId}, message role: ${message.role}`
  );

  if (conversations.has(conversationId)) {
    const conversation = conversations.get(conversationId)!;
    conversation.messages.push(message);
    console.log(
      `Successfully added message. Conversation now has ${conversation.messages.length} messages`
    );
  } else {
    console.error(
      `Conversation ${conversationId} not found for single message! Available conversations:`,
      Array.from(conversations.keys())
    );
  }
}

/**
 * Add multiple messages to an existing conversation
 */
export function addMessages(
  conversationId: string,
  messages: ChatMessage[]
): void {
  console.log(
    `addMessages called with conversationId: ${conversationId}, messages count: ${messages.length}`
  );

  if (conversations.has(conversationId)) {
    const conversation = conversations.get(conversationId)!;
    const beforeCount = conversation.messages.length;
    conversation.messages.push(...messages);
    const afterCount = conversation.messages.length;

    console.log(
      `Successfully added ${messages.length} messages. Before: ${beforeCount}, After: ${afterCount}`
    );
  } else {
    console.error(
      `Conversation ${conversationId} not found! Available conversations:`,
      Array.from(conversations.keys())
    );
  }
}

/**
 * Get a conversation by ID
 */
export function getConversation(
  conversationId: string
): { id: string; messages: ChatMessage[] } | null {
  return conversations.get(conversationId) || null;
}

/**
 * Debug function to list all conversations
 */
export function debugConversations(): void {
  console.log("=== Current Conversations ===");
  for (const [id, conv] of conversations.entries()) {
    console.log(`Conversation ${id}: ${conv.messages.length} messages`);
    conv.messages.forEach((msg, index) => {
      console.log(
        `  ${index + 1}. ${msg.role}: ${msg.content.substring(0, 100)}...`
      );
    });
  }
  console.log("=============================");
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
 * Create a conversation summary for streamed products
 */
export function createProductStreamSummary(
  productCount: number,
  searchQuery: string
): ChatMessage {
  return {
    role: "assistant",
    content: `Found ${productCount} products for "${searchQuery}". Products were streamed above.`,
  };
}
