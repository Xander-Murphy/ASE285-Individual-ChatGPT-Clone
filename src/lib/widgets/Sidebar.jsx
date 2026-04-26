import React from "react";

export default function Sidebar({ conversations, activeID, onSelect, onCreate, onDelete }) {
  return (
    <div className="sidebar">
      <button className="sidebar-new" onClick={onCreate}>+ New Chat</button>
      <div className="sidebar-list">
        {conversations.map((convo) => (
          <div
            key={convo.conversationID}
            className={`sidebar-item ${convo.conversationID === activeID ? "active" : ""}`}
            onClick={() => onSelect(convo.conversationID)}
          >
            <span className="sidebar-title">{convo.title}</span>
            <button
              className="sidebar-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(convo.conversationID);
              }}
            >X
            </button>
            </div>
          ))}
      </div>
    </div>
  );
}