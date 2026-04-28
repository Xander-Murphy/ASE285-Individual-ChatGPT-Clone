import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatScreen from "../../src/lib/screens/ChatScreen";

// Integration tests mock the WebSocket boundary but let everything
// else (localStorage, conversations, sidebar, messages) work together

vi.mock("../../src/lib/services/chatServices", () => ({
  connectWebSocket: vi.fn(),
  sendMessageToServer: vi.fn(),
  onToken: vi.fn(),
}));

import { onToken, sendMessageToServer } from "../../src/lib/services/chatServices";

describe("ChatScreen Integration", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sidebar and chat window show the same active conversation", () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "My Test Chat",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    const sidebar = document.querySelector(".sidebar");
    expect(within(sidebar).getByText("My Test Chat")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent("My Test Chat");
  });

  it("sending a message saves it to localStorage", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Save this" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem("conversations"));
      const messages = saved[0].messages;
      expect(messages.some((m) => m.content === "Save this")).toBe(true);
    });
  });

  it("switching conversations updates the chat window", () => {
    const convoID1 = crypto.randomUUID();
    const convoID2 = crypto.randomUUID();

    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID1,
        title: "Chat One",
        createdAt: Date.now(),
        messages: [{ messageID: "1", role: "user", content: "Message in chat one", timestamp: 0 }],
      },
      {
        conversationID: convoID2,
        title: "Chat Two",
        createdAt: Date.now(),
        messages: [{ messageID: "2", role: "user", content: "Message in chat two", timestamp: 0 }],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID1);

    render(<ChatScreen />);

    expect(screen.getByText("Message in chat one")).toBeInTheDocument();

    const sidebar = document.querySelector(".sidebar");
    fireEvent.click(within(sidebar).getByText("Chat Two"));

    expect(screen.getByText("Message in chat two")).toBeInTheDocument();
    expect(screen.queryByText("Message in chat one")).not.toBeInTheDocument();
  });

  it("deleting the active conversation switches to another", () => {
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

    expect(screen.getByRole("banner")).toHaveTextContent("Chat One");

    const deleteButtons = document.querySelectorAll(".sidebar-delete");
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByRole("banner")).toHaveTextContent("Chat Two");
  });

  it("streamed tokens appear in the correct conversation", async () => {
    let tokenCallback = null;
    onToken.mockImplementation((cb) => { tokenCallback = cb; });

    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "Stream Test",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Stream this" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => expect(tokenCallback).not.toBeNull());

    tokenCallback("Hello ");
    tokenCallback("world");
    tokenCallback(null);

    const chatWindow = document.querySelector(".chat-window");
    await waitFor(() => {
      expect(within(chatWindow).getByText("Hello world")).toBeInTheDocument();
    });
  });

  it("deleting last conversation creates a new one", () => {
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

});