import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatScreen from "../../src/lib/screens/ChatScreen";

// Regression tests verify that previously fixed bugs do not come back.
// Each test is named after the bug it protects against.

vi.mock("../../src/lib/services/chatServices", () => ({
  connectWebSocket: vi.fn(),
  sendMessageToServer: vi.fn(),
  onToken: vi.fn(),
}));

import { sendMessageToServer } from "../../src/lib/services/chatServices";

describe("Regression Tests", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("BUG: sending empty input does not call sendMessageToServer", () => {
    render(<ChatScreen />);
    fireEvent.click(screen.getByText("Send"));
    expect(sendMessageToServer).not.toHaveBeenCalled();
  });

  it("BUG: sending empty input does not add a blank bubble", () => {
    render(<ChatScreen />);
    fireEvent.click(screen.getByText("Send"));
    const chatWindow = document.querySelector(".chat-window");
    expect(chatWindow.querySelectorAll(".bubble").length).toBe(0);
  });

  it("BUG: deleting the last conversation creates a new one automatically", () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "Only Chat",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    const deleteButtons = document.querySelectorAll(".sidebar-delete");
    fireEvent.click(deleteButtons[0]);

    const saved = JSON.parse(localStorage.getItem("conversations"));
    expect(saved.length).toBe(1);
    expect(screen.getByRole("banner")).toHaveTextContent("New Chat");
  });

  it("BUG: active conversation ID updates when switching chats", () => {
    const convoID1 = crypto.randomUUID();
    const convoID2 = crypto.randomUUID();

    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID1,
        title: "First Chat",
        createdAt: Date.now(),
        messages: [],
      },
      {
        conversationID: convoID2,
        title: "Second Chat",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID1);

    render(<ChatScreen />);

    const sidebar = document.querySelector(".sidebar");
    fireEvent.click(within(sidebar).getByText("Second Chat"));

    const savedID = localStorage.getItem("activeConversationID");
    expect(savedID).toBe(convoID2);
  });

  it("BUG: messages are saved to the correct conversation, not all conversations", async () => {
    const convoID1 = crypto.randomUUID();
    const convoID2 = crypto.randomUUID();

    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID1,
        title: "Chat One",
        createdAt: Date.now(),
        messages: [],
      },
      {
        conversationID: convoID2,
        title: "Chat Two",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID1);

    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Only in chat one" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("conversations"));
      const chatOne = saved.find((c) => c.conversationID === convoID1);
      const chatTwo = saved.find((c) => c.conversationID === convoID2);
      expect(chatOne.messages.some((m) => m.content === "Only in chat one")).toBe(true);
      expect(chatTwo.messages.length).toBe(0);
    });
  });

  it("BUG: input clears after sending a message", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Clear me" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("BUG: deleting a non-active conversation does not change the active chat", () => {
    const convoID1 = crypto.randomUUID();
    const convoID2 = crypto.randomUUID();

    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID1,
        title: "Active Chat",
        createdAt: Date.now(),
        messages: [],
      },
      {
        conversationID: convoID2,
        title: "Other Chat",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID1);

    render(<ChatScreen />);

    expect(screen.getByRole("banner")).toHaveTextContent("Active Chat");

    const deleteButtons = document.querySelectorAll(".sidebar-delete");
    fireEvent.click(deleteButtons[1]);

    expect(screen.getByRole("banner")).toHaveTextContent("Active Chat");
  });

  it("BUG: conversations persist across simulated page reloads", () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "Persisted Chat",
        createdAt: Date.now(),
        messages: [
          { messageID: "1", role: "user", content: "Still here", timestamp: 0 }
        ],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    expect(screen.getByText("Still here")).toBeInTheDocument();
  });

});