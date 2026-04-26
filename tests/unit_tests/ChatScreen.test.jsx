import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatScreen from "../../src/lib/screens/ChatScreen";

vi.mock("../../src/lib/services/chatServices", () => ({
  connectWebSocket: vi.fn(),
  sendMessageToServer: vi.fn(),
  onToken: vi.fn(),
}));

vi.mock("../../src/lib/models/message", () => ({
  createMessage: vi.fn((role, content) => ({ messageID: crypto.randomUUID(), role, content })),
}));

import { sendMessageToServer } from "../../src/lib/services/chatServices";

describe("ChatScreen", () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the header", () => {
    render(<ChatScreen />);
    expect(screen.getByRole("banner")).toHaveTextContent("New Chat");
  });

  it("renders the input and send button", () => {
    render(<ChatScreen />);
    expect(screen.getByPlaceholderText("Send a message...")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("renders messages loaded from localStorage", () => {
    const convoID = crypto.randomUUID();
    localStorage.setItem("conversations", JSON.stringify([
      {
        conversationID: convoID,
        title: "New Chat",
        createdAt: Date.now(),
        messages: [
          { messageID: "1", role: "user", content: "Saved message", timestamp: 0 }
        ]
      }
    ]));
    localStorage.setItem("activeConversationID", convoID);

    render(<ChatScreen />);
    expect(screen.getByText("Saved message")).toBeInTheDocument();
  });

  it("sends a message when Send is clicked", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Hi there" } });
    fireEvent.click(screen.getByText("Send"));

    const chatWindow = document.querySelector(".chat-window");
    expect(await within(chatWindow).findByText("Hi there")).toBeInTheDocument();
    expect(sendMessageToServer).toHaveBeenCalledWith(
      "Hi there",
      expect.arrayContaining([
        expect.objectContaining({ role: "user", content: "Hi there" })
      ])
    );
  });

  it("clears the input after sending a message", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("does not call sendMessageToServer when input is empty", () => {
    render(<ChatScreen />);
    fireEvent.click(screen.getByText("Send"));
    expect(sendMessageToServer).not.toHaveBeenCalled();
  });

  it("sends a message when Enter is pressed", async () => {
    render(<ChatScreen />);

    const input = screen.getByPlaceholderText("Send a message...");
    fireEvent.change(input, { target: { value: "Pressing enter" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(sendMessageToServer).toHaveBeenCalledWith(
        "Pressing enter",
        expect.arrayContaining([
          expect.objectContaining({ role: "user", content: "Pressing enter" })
        ])
      );
    });
  });

});