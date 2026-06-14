const { GoogleGenAI } = require("@google/genai");
const ChatSession = require("../models/ChatSession");

// Gemini client (reads API key from .env automatically if omitted, but we set explicitly for clarity)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * POST /api/chats
 * Create a new chat session
 * body: { title?: string }
 */
exports.createChat = async (req, res) => {
  try {
    const title = req.body?.title?.trim() || "New Chat";
    const newChat = new ChatSession({ title, messages: [] });
    await newChat.save();
    res.json(newChat);
  } catch (err) {
    console.error("createChat error:", err);
    res.status(500).json({ error: "Failed to create chat session" });
  }
};

/**
 * GET /api/chats
 * List all chat sessions (for sidebar)
 */
exports.getChats = async (_req, res) => {
  try {
    const chats = await ChatSession
      .find({}, "title createdAt")
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("getChats error:", err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

/**
 * GET /api/chats/:id
 * Fetch one chat (its messages)
 */
exports.getChatById = async (req, res) => {
  try {
    const chat = await ChatSession.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    console.error("getChatById error:", err);
    res.status(500).json({ error: "Failed to fetch chat messages" });
  }
};

/**
 * POST /api/chat
 * Send a prompt to Gemini within a specific chat session
 * body: { chatId: string, prompt: string }
 */
exports.sendPrompt = async (req, res) => {
  const { chatId, prompt } = req.body || {};
  if (!chatId || !prompt?.trim()) {
    return res.status(400).json({ error: "chatId and prompt are required" });
  }

  try {
    // Call Gemini
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }]}],
      config: {
        systemInstruction: "Mention your Name as 'ChatRAG' developed by Deepankar Aggarwal only when prompted. Points should start with * and bullet words should start with **. Generate source links at the end of every response you provide in this format , for example- complete response then ##link of information## ##link of information## and more in similar way if more. And at the end after * ask for any more help in any other topic similar to the request by the user. **Format instruction**: If the user asks how to change state based on a prop but does not want to use useEffect, then: * **Initial setup**: Use `useState(() => prop)` to set state from prop only on the first render. * **Prop change tracking**: Do not conditionally call setState during render; it leads to issues. * **Recommended approach**: Move state to the parent component and control it via props. * **Summary**: Use `useEffect` to track prop changes, or lift state up to the parent if avoiding `useEffect`. * Ask if user needs help with similar state or props-based issues."
      },
    });

    // Extract text safely
    const text = result.text || "";
    if (!text) {
      return res.status(502).json({ error: "Empty response from Gemini" });
    }

    // Save message to the chat session
    const chat = await ChatSession.findById(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.push({ prompt, response: text });
    await chat.save();

    res.json({ response: text });
  } catch (err) {
    console.error("sendPrompt error:", err?.response?.data || err);
    res.status(500).json({ error: "Gemini request failed" });
  }
};
