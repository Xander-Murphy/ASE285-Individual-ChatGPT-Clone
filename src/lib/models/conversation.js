export function createConversation() {
  return {
    conversationID: crypto.randomUUID(),
    title: "New Chat",
    createdAt: Date.now(),
    messages: [],
  };
}