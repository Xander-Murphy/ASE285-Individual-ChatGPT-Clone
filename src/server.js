import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

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

// In-memory chat session
let chatSession = {
  sessionID: uuidv4(),
  createdAt: new Date(),
  conversations: [
    {
      conversationID: uuidv4(),
      title: "New Chat",
      messages: [],
    }
  ]
};

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    // Build message list from client history + new user message
    const messages = [
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
    });

    const assistantReply = response.choices[0].message.content;

    res.json({ reply: assistantReply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server runnign on port ${PORT}`);
});