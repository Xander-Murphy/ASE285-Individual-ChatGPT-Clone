import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { WebSocketServer } from "ws";
import { createServer } from "http";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const server = createServer(app);

const wss = new WebSocketServer({ server })


wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (data) => {
    try {
      const { message, history } = JSON.parse(data);

      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant. When writing math, always use standard LaTeX delimiters: \\(...\\) for inline math and \\[...\\] for display math."
        },
        ...history.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      const stream = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages,
        stream: true,
      });

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
          ws.send(JSON.stringify({ type: "token", token }));
          await sleep(30);
        }
      }

      ws.send(JSON.stringify({ type: "done" }));

    } catch (error) {
      console.error(error);
      ws.send(JSON.stringify({ type: "error", message: "Something went wrong" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});