import React from "react";

export default function MessageBubble({ message }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        {message.content}
      </div>
    </div>
  );
}