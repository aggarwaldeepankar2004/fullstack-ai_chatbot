const express = require("express");
const router = express.Router();
const {
  createChat,
  getChats,
  getChatById,
  sendPrompt
} = require("../controllers/chatController");

router.post("/chats", createChat);     // create new session
router.get("/chats", getChats);        // list sessions (sidebar)
router.get("/chats/:id", getChatById); // one session with messages
router.post("/chat", sendPrompt);      // send message to a session

module.exports = router;
