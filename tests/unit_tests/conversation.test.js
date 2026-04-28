import { describe, it, expect } from "vitest";
import { createConversation } from "../../src/lib/models/conversation";

describe("createConversation", () => {

  it("creates a conversation with a unique conversationID", () => {
    const convo1 = createConversation();
    const convo2 = createConversation();
    expect(convo1.conversationID).toBeDefined();
    expect(convo2.conversationID).toBeDefined();
    expect(convo1.conversationID).not.toBe(convo2.conversationID);
  });

  it("defaults title to New Chat when no title is provided", () => {
    const convo = createConversation();
    expect(convo.title).toBe("New Chat");
  });

  it("uses the provided title", () => {
    const convo = createConversation("My Chat");
    expect(convo.title).toBe("My Chat");
  });

  it("starts with an empty messages array", () => {
    const convo = createConversation();
    expect(convo.messages).toEqual([]);
  });

  it("includes a createdAt timestamp", () => {
    const before = Date.now();
    const convo = createConversation();
    const after = Date.now();
    expect(convo.createdAt).toBeGreaterThanOrEqual(before);
    expect(convo.createdAt).toBeLessThanOrEqual(after);
  });

});