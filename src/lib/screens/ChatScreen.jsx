import React, { useState, useEffect, useRef } from "react";
import { sendMessageToServer } from "../services/chatServices";
import { createMessage } from "../models/message";
import { createConversation } from "../models/conversation";
import MessageBubble from "../widgets/messageBubble";
import Sidebar from "../widgets/sideBar";

export default function ChatScreen() {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    if (saved) return JSON.parse(saved);
    const initial = createConversation();
    return [initial];
  });

  const [activeID, setActiveID] = useState(() => {
    return localStorage.getItem("activeConversationID") ?? conversations[0].conversationID;
  });

  const chatEndRef = useRef(null);

  //Active conversation's messages from state
  const activeConversation = conversations.find((c) => c.conversationID === activeID);
  const activeMessages = activeConversation?.messages ?? [];

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("activeConversationID", activeID);
  }, [activeID]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);
  const [input, setInput] = useState("");

  const sendMessage = async (input) => {
    if (!input) return;

    const userMessage = createMessage("user", input);

    setConversations((prev) =>
      prev.map((c) =>
        c.conversationID === activeID
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      )
    );

    const data = await sendMessageToServer(input, [...activeMessages, userMessage]);
    const assistantMessage = createMessage("assistant", data.reply);

    setConversations((prev) =>
      prev.map((c) =>
        c.conversationID === activeID
          ? { ...c, messages: [...c.messages, assistantMessage] }
          : c
      )
    );
  };

  const handleCreate = () => {
    const title = prompt("Enter a short name for your chat (This is for you only and cannot be changed)") || "New Chat";
    const newConvo = createConversation(title);
    setConversations((prev) => [...prev, newConvo]);
    setActiveID(newConvo.conversationID);
  };

  const handleDelete = (id) => {
    const remaining = conversations.filter((c) => c.conversationID !== id);

    if (remaining.length === 0) {
      const newConvo = createConversation();
      setConversations([newConvo]);
      setActiveID(newConvo.conversationID);
      return;
    }

    setConversations(remaining);

    if (id === activeID) {
      setActiveID(remaining[remaining.length - 1].conversationID);
    }
  };
  
  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeID={activeID}
        onSelect={setActiveID}
        onCreate={handleCreate}
        onDelete={handleDelete}
      />

      <div className="main">
        <header className="header">
          {activeConversation?.title ?? "My GPT Clone"}
        </header>

        <div className="chat-window">
          {activeMessages.map((msg) => (
            <MessageBubble key={msg.messageID} message={msg} />
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(input);
                setInput("");
              }
            }}
          />
          <button onClick={() => {sendMessage(input); setInput("");}}>Send</button>
        </div>
      </div>
    </div>
  );
}