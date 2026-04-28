import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

// ─── Mock Factories ───────────────────────────────────────────────────────────

export function createMockMessage(overrides = {}) {
  return {
    messageID: crypto.randomUUID(),
    role: "user",
    content: "Test message",
    timestamp: Date.now(),
    ...overrides,
  };
}

export function createMockConversation(overrides = {}) {
  return {
    conversationID: crypto.randomUUID(),
    title: "Test Chat",
    createdAt: Date.now(),
    messages: [],
    ...overrides,
  };
}

// ─── localStorage Helpers ─────────────────────────────────────────────────────

export function seedConversations(conversations) {
  const activeID = conversations[0].conversationID;
  localStorage.setItem("conversations", JSON.stringify(conversations));
  localStorage.setItem("activeConversationID", activeID);
  return activeID;
}

export function seedConversationsWithActive(conversations, activeID) {
  localStorage.setItem("conversations", JSON.stringify(conversations));
  localStorage.setItem("activeConversationID", activeID);
}

export function getStoredConversations() {
  return JSON.parse(localStorage.getItem("conversations")) ?? [];
}

export function getStoredActiveID() {
  return localStorage.getItem("activeConversationID");
}

// ─── WebSocket Mock ───────────────────────────────────────────────────────────

export function createMockChatServices() {
  return {
    connectWebSocket: vi.fn(),
    sendMessageToServer: vi.fn(),
    onToken: vi.fn(),
  };
}

export function simulateTokenStream(onTokenMock, tokens) {
  let callback = null;
  onTokenMock.mockImplementation((cb) => { callback = cb; });
  return {
    fire: () => {
      tokens.forEach((token) => callback(token));
      callback(null);
    },
    getCallback: () => callback,
  };
}

// ─── Common beforeEach Setup ──────────────────────────────────────────────────

export function setupTest() {
  localStorage.clear();
  vi.clearAllMocks();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}