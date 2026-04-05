export function createMessage(role, content) {
  return {
    messageID: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
  };
}