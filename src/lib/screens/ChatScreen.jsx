import React, { useState, useEffect, useRef } from "react";
import { connectWebSocket, onToken, sendMessageToServer } from "../services/chatServices";
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

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const chatEndRef = useRef(null);
  const activeIDRef = useRef(activeID);
  const streamingIDRef = useRef(null);
  const [streamingID, setStreamingID] = useState(null);

  useEffect(() => {
    activeIDRef.current = activeID;
  }, [activeID]);

  //Active conversation's messages from state
  const activeConversation = conversations.find((c) => c.conversationID === activeID);
  const activeMessages = activeConversation?.messages ?? [];

  useEffect(() => {
    connectWebSocket();

    onToken((token) => {
      if (token === null) {
        streamingIDRef.current = null;
        setStreamingID(null);
        return;
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.conversationID !== activeIDRef.current) return c;

          const messages = [...c.messages];
          const lastMessage = messages[messages.length -1];

          if (lastMessage && lastMessage.messageID === streamingIDRef.current) {
            const updated = { ...lastMessage, content: lastMessage.content + token };
            messages[messages.length - 1] = updated;
            return { ...c, messages };
          }

          const newMessage = createMessage("assistant", token);
          streamingIDRef.current = newMessage.messageID;
          setStreamingID(newMessage.messageID);
          return { ...c, messages: [...messages, newMessage] };
        })
      );
    });
  }, []);

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

  const sendMessage = (input) => {
    if (!input) return;

    const userMessage = createMessage("user", input);

    setConversations((prev) =>
      prev.map((c) =>
        c.conversationID === activeID
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      )
    );

    sendMessageToServer(input, [...activeMessages, userMessage]);
  };

  const handleCreate = () => {
    setShowNewChatModal(true);
  };

  const confirmCreate = () => {
    const title = newChatTitle.trim() || "New Chat";
    const newConvo = createConversation(title);
    setConversations((prev) => [...prev, newConvo]);
    setActiveID(newConvo.conversationID);
    setNewChatTitle("");
    setShowNewChatModal(false);
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
            <MessageBubble
              key={msg.messageID}
              message={msg}
              isStreaming={msg.messageID === streamingID}
            />
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
      {showNewChatModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>New Chat</h3>
              <input
                autoFocus
                value={newChatTitle}
                onChange={(e) => setNewChatTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmCreate()}
                placeholder="Enter a chat name..."
              />
              <div className="modal-buttons">
                <button onClick={confirmCreate}>Create</button>
                <button onClick={() => setShowNewChatModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}