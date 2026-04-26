export function createConversation(title = "New Chat") {
  return {
    conversationID: crypto.randomUUID(),
    title,
    createdAt: Date.now(),
    messages: [],
  };
}