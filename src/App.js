import React, { useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar.js";
import ChatWindow from "./components/chat-window/ChatWindow.js";
import './App.css';

export default function App() {
  const [activeChatId, setActiveChatId] = useState(null);
  const [firstPrompt, setFirstPrompt] = useState("");

  const handleNewChat = (id) => {
    setActiveChatId(id);
  };

  const handleFirstPrompt = (prompt) => {
    console.log("Received first prompt:", prompt);
    setFirstPrompt(prompt);
  };

  return (
    <>
      <Sidebar onSelectChat={setActiveChatId} onNewChat={handleNewChat} activeChatId={activeChatId} chatTitle={firstPrompt}></Sidebar>
      <ChatWindow chatId={activeChatId} onFirstPrompt={handleFirstPrompt}></ChatWindow>
    </>
  );
}
