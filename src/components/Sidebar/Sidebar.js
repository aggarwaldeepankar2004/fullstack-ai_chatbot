import React, { useEffect, useState } from "react";
import { PanelLeft, Plus, MessageSquare, Info, ClockFading, Settings} from 'lucide-react';
import axios from "axios";
import './Sidebar.css';

export default function Sidebar({ onSelectChat, onNewChat, activeChatId, chatTitle }) {
  const [chats, setChats] = useState([]);
  const[extended, setExtended] = useState(false);
  

  const loadChats = async () => {
    const { data } = await axios.get(`http://localhost:5000/api/chats`);
    setChats(data);
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleNewChat = async () => {
    const { data } = await axios.post(`http://localhost:5000/api/chats`, { title: chatTitle || "New Chat"});
    onNewChat(data._id);
    await loadChats();
  };

  return (
    <>
    <div className="sidebar">
      <div className="top">
        <p><PanelLeft onClick = {() => setExtended(prev => !prev)} className="icons menu" color="#ffffff" /></p>
        <div className="new-chat" onClick={handleNewChat}>
          <p><Plus className="icons" color="#ffffff" /></p>
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended ?
        <div className="recent">
            <p className="recent-title">Chats</p>
            <div className="recent-entry">
                {chats.map((c) => (
                  <div className="prompt" key={c._id} onClick={() => onSelectChat(c._id)} title={new Date(c.createdAt).toLocaleString()}>
                    <p><MessageSquare className="icons" color="#ffffff" /></p>
                    {c.title}
                  </div>
                ))}
            </div>
        </div>
        : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <p><Info className="icons" color="#ffffff" /></p>
          {extended ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <p><ClockFading className="icons" color="#ffffff" /></p>
          {extended ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <p><Settings className="icons" color="#ffffff" /></p>
          {extended ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
    </>
  );
}

