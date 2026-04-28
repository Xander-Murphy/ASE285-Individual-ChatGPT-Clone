import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi, describe, it, expect } from "vitest";
import Sidebar from "../../src/lib/widgets/sideBar";

const mockConversations = [
  { conversationID: "1", title: "Chat One", messages: [] },
  { conversationID: "2", title: "Chat Two", messages: [] },
];

describe("Sidebar", () => {

  it("renders all conversations", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={vi.fn()}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("Chat One")).toBeInTheDocument();
    expect(screen.getByText("Chat Two")).toBeInTheDocument();
  });

  it("marks the active conversation with the active class", () => {
    const { container } = render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={vi.fn()}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const items = container.querySelectorAll(".sidebar-item");
    expect(items[0]).toHaveClass("active");
    expect(items[1]).not.toHaveClass("active");
  });

  it("calls onSelect with the correct ID when a conversation is clicked", () => {
    const onSelect = vi.fn();
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={onSelect}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Chat Two"));
    expect(onSelect).toHaveBeenCalledWith("2");
  });

  it("calls onCreate when the New Chat button is clicked", () => {
    const onCreate = vi.fn();
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={vi.fn()}
        onCreate={onCreate}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("+ New Chat"));
    expect(onCreate).toHaveBeenCalled();
  });

  it("calls onDelete with the correct ID when delete is clicked", () => {
    const onDelete = vi.fn();
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={vi.fn()}
        onCreate={vi.fn()}
        onDelete={onDelete}
      />
    );
    const deleteButtons = screen.getAllByText("X");
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("does not call onSelect when delete button is clicked", () => {
    const onSelect = vi.fn();
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={onSelect}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const deleteButtons = screen.getAllByText("X");
    fireEvent.click(deleteButtons[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("renders the New Chat button", () => {
    render(
      <Sidebar
        conversations={mockConversations}
        activeID="1"
        onSelect={vi.fn()}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText("+ New Chat")).toBeInTheDocument();
  });

  it("renders an empty sidebar with no conversations", () => {
    const { container } = render(
      <Sidebar
        conversations={[]}
        activeID={null}
        onSelect={vi.fn()}
        onCreate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    const items = container.querySelectorAll(".sidebar-item");
    expect(items.length).toBe(0);
  });

});