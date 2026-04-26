import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MessageBubble({ message, isStreaming }) {
  return (
    <div className={`message ${message.role}`}>
      <div className="bubble">
        {message.role === "assistant"
          ? isStreaming
            ? <span style={{ whiteSpace: "pre-wrap" }}>{message.content}</span>
            : (
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {message.content}
              </ReactMarkdown>
            )
          : message.content
        }
      </div>
    </div>
  );
}