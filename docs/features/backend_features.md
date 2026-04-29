# Backend Requirements

## Features
1. Chat sessions — WebSocket connection maintains a live session between client and server
2. Conversation history — full message history received from client on every request for AI context
3. Streaming responses — Groq API called with stream: true, tokens forwarded to client as they arrive