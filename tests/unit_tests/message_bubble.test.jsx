import React from "react"
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import MessageBubble from "../../src/lib/widgets/messageBubble";

describe("MessageBubble", () => {

  it("renders the message content", () => {
    const message = { role: "user", content: "Hello!" };
    render(<MessageBubble message={message} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  it("applies the correct role class for a user message", () => {
    const message = { role: "user", content: "Hi" };
    const { container } = render(<MessageBubble message={message} />);
    expect(container.firstChild).toHaveClass("user");
  });

  it("applies the correct role class for an assistant message", () => {
    const message = { role: "assistant", content: "How can I help?" };
    const { container } = render(<MessageBubble message={message} />);
    expect(container.firstChild).toHaveClass("assistant");
  });

  it("always renders the outer message class", () => {
    const message = { role: "user", content: "Test" };
    const { container } = render(<MessageBubble message={message} />);
    expect(container.firstChild).toHaveClass("message");
  });

  it("renders content inside the bubble div", () => {
    const message = { role: "assistant", content: "I am an AI." };
    const { container } = render(<MessageBubble message={message} />);
    const bubble = container.querySelector(".bubble");
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveTextContent("I am an AI.");
  });

  it("renders assistant message inside the bubble", () => {
    const message = { role: "assistant", content: "**bold text**" };
    const { container } = render(<MessageBubble message={message} />);
    const bubble = container.querySelector(".bubble");
    expect(bubble).toBeInTheDocument();
    expect(bubble).toHaveTextContent("bold text");
  });

  it("renders user messages as plain text without markdown", () => {
    const message = { role: "user", content: "**not bold**" };
    const { container } = render(<MessageBubble message={message} />);
    const bold = container.querySelector("strong");
    expect(bold).not.toBeInTheDocument();
    expect(screen.getByText("**not bold**")).toBeInTheDocument();
  });

});