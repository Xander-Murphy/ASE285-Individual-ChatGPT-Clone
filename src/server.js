import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

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