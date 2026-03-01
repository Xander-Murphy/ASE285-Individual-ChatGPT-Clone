import React, {useState, useEffect} from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages)); 
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
       role: "assistant",
       content: data.reply
      },
    ]);

    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
        <h1>My GPT Clone</h1>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div> 
  );
}

createRoot(document.getElementById("root")).render(<App />);