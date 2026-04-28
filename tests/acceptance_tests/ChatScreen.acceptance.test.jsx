import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatScreen from "../../src/lib/screens/ChatScreen";

// Acceptance tests simulate real user stories
// We only mock the WebSocket since we can't run a real server in tests

vi.mock("../../src/lib/services/chatServices", () => ({
  connectWebSocket: vi.fn(),
  sendMessageToServer: vi.fn(),
  onToken: vi.fn(),
}));

import { onToken, sendMessageToServer } from "../../src/lib/services/chatServices";

describe("User Acceptance Tests", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("user can send a message and see it appear in the chat", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(screen.getByText("Send"));

    const chatWindow = document.querySelector(".chat-window");
    expect(await within(chatWindow).findByText("Hello!")).toBeInTheDocument();
  });

  it("user can send a message by pressing Enter", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Sent with Enter" } });
    fireEvent.keyDown(input, { key: "Enter" });

    const chatWindow = document.querySelector(".chat-window");
    expect(await within(chatWindow).findByText("Sent with Enter")).toBeInTheDocument();
  });

  it("user sees the AI response stream in after sending a message", async () => {
    let tokenCallback = null;
    onToken.mockImplementation((cb) => { tokenCallback = cb; });

    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Hi AI!" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => expect(tokenCallback).not.toBeNull());

    tokenCallback("I ");
    tokenCallback("am ");
    tokenCallback("an AI.");
    tokenCallback(null);

    const chatWindow = document.querySelector(".chat-window");
    await waitFor(() => {
      expect(within(chatWindow).getByText("I am an AI.")).toBeInTheDocument();
    });
  });

  it("user cannot send an empty message", () => {
    render(<ChatScreen />);

    fireEvent.click(screen.getByText("Send"));

    expect(sendMessageToServer).not.toHaveBeenCalled();
    const chatWindow = document.querySelector(".chat-window");
    expect(chatWindow.querySelectorAll(".bubble").length).toBe(0);
  });

  it("user can create a new chat and switch to it", async () => {
    render(<ChatScreen />);

    fireEvent.click(screen.getByText("+ New Chat"));

    expect(screen.getByPlaceholderText("Enter a chat name...")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Enter a chat name..."), {
      target: { value: "My New Chat" },
    });
    fireEvent.click(screen.getByText("Create"));

    expect(screen.getByRole("banner")).toHaveTextContent("My New Chat");
  });

  it("user can delete a chat", async () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "Chat to Delete",
        createdAt: Date.now(),
        messages: [],
      },
      {
        conversationID: crypto.randomUUID(),
        title: "Other Chat",
        createdAt: Date.now(),
        messages: [],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    const sidebar = document.querySelector(".sidebar");
    expect(within(sidebar).getByText("Chat to Delete")).toBeInTheDocument();

    const deleteButtons = document.querySelectorAll(".sidebar-delete");
    fireEvent.click(deleteButtons[0]);

    expect(within(sidebar).queryByText("Chat to Delete")).not.toBeInTheDocument();
  });

  it("user's conversations persist after a page refresh", () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "Persistent Chat",
        createdAt: Date.now(),
        messages: [
          { messageID: "1", role: "user", content: "This should persist", timestamp: 0 }
        ],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);

    expect(screen.getByText("This should persist")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toHaveTextContent("Persistent Chat");
  });

  it("user can switch between chats and see different messages", () => {
    const convoID1 = crypto.randomUUID();
    const convoID2 = crypto.randomUUID();

    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID1,
        title: "Work Chat",
        createdAt: Date.now(),
        messages: [{ messageID: "1", role: "user", content: "Work stuff", timestamp: 0 }],
      },
      {
        conversationID: convoID2,
        title: "Personal Chat",
        createdAt: Date.now(),
        messages: [{ messageID: "2", role: "user", content: "Personal stuff", timestamp: 0 }],
      }
    ]));
    localStorage.setItem("activeConversationID", convoID1);

    render(<ChatScreen />);

    expect(screen.getByText("Work stuff")).toBeInTheDocument();

    const sidebar = document.querySelector(".sidebar");
    fireEvent.click(within(sidebar).getByText("Personal Chat"));

    expect(screen.getByText("Personal stuff")).toBeInTheDocument();
    expect(screen.queryByText("Work stuff")).not.toBeInTheDocument();
  });

});