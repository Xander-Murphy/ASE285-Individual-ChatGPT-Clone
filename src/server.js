import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("src"));

// ... (your express/dotenv imports stay the same)

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // The NEW way to call Gemini in @google/genai:
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // or "gemini-2.0-flash"
      contents: message,
    });
    
    res.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
