import React, {useState, useEffect, useRef} from "react";
import { sendMessageToServer } from "./lib/services/chatServices";
import { createMessage } from "./lib/models/message";
import { createRoot } from "react-dom/client";
import "/styles.css"

function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chat", JSON.stringify(messages)); 
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const sendMessage = async () => {
    if (!input) return;

    const userMessage = createMessage("user", input);

    setMessages((prev) => [...prev, userMessage]);

    const data = await sendMessageToServer(input);

    const assistantMessage = createMessage("assistant", data.reply);

    setMessages((prev) => [...prev, assistantMessage]);

    setInput("");
  };

  return (
    <div className="app">
      <header className="header">
        My GPT Clone
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
          >
            <div className="bubble">
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      <div className="input-bar">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);