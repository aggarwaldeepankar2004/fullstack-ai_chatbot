import React, { useEffect, useState } from "react";
import { User, Compass, Lightbulb, MessageSquare, SquareCode, Images, Mic, SendHorizontal, Sparkles, ThumbsUp, ThumbsDown, Copy} from 'lucide-react';
import axios from "axios";
import './ChatWindow.css';

export default function ChatWindow({ chatId, onFirstPrompt}) {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goodClicked, setGoodClicked] = useState(false);
  const [badClicked, setBadClicked] = useState(false);
  const [isFirstPromptSent, setIsFirstPromptSent] = useState(false);


  const loadMessages = async () => {
    setPrompt("");
    if (!chatId) return ;
    const { data } = await axios.get(`http://localhost:5000/api/chats/${chatId}`);
    setLoading(false);
    setMessages(data?.messages || []);
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const sendPrompt = async () => {
    setLoading(true);
    setShowResult(true);
    if (!prompt.trim()) return;
    const { data } = await axios.post(`http://localhost:5000/api/chat`, { chatId, prompt });
    setMessages((prev) => [...prev, { prompt, response: data.response }]);
    setPrompt("");
  };

    if (!isFirstPromptSent) {
      onFirstPrompt(prompt); 
      setIsFirstPromptSent(true);
    }

    const goodFeed = () => {
        setGoodClicked(prev => !prev);
    }
    const badFeed = () => {
        setBadClicked(prev => !prev);
    }

    const handleCopy = (index) =>{
        const rawHtml = messages[index];

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawHtml;
        const plainText = tempDiv.textContent || tempDiv.innerText;

        navigator.clipboard.writeText(plainText)
            .then(() => alert("Copied to clipboard!"))
            .catch((err) => alert("Failed to copy: " + err));
    }

  return (
    <div className="main">
        <div className="nav">
            <p className="title" onClick={(() => setShowResult(false))}>ChatRAG</p>
            <p className="user-icon"><User className="icons user" color="#ffffff" /></p>
        </div>
    <div className="main-inner">
        <div className="main-container">
            <div className="result">
                  {messages.map((m, idx) => (
                    <div key={idx}>
                        <div className="result-title">
                            <p className="user-icon"><User className="icons user" color="#ffffff" /></p>
                            <p>{m.prompt}</p>
                        </div>
                        <div className="result-data">
                            {!loading && <h1><Sparkles size={36} /></h1>}
                            <div className="result-data-div">
                                <div className="data-div">
                                    {m.response}
                                    <hr/>
                                    {!loading && 
                                        <div className="utility">
                                            {!badClicked && <ThumbsUp className="good" onClick={ goodFeed} style={{color : goodClicked && "#5645ee"}}/>}
                                            {!goodClicked && <ThumbsDown className="bad" onClick={ badFeed} style={{color: badClicked && "#5645ee"}}/>}                                    
                                            <Copy className="copy" onClick={() => handleCopy(idx)}/>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                  ))}
                {loading && <>
                    <div>{prompt}</div>
                        <div className="result-data"> 
                            <h1><Sparkles size={36} /></h1>
                            <div className="loader">
                                <hr/>   
                                <hr/>   
                                <hr/>
                            </div>   
                        </div>
                    </>
                }
                {!messages.length && !loading && <>
            <div className="greet">     
                <p><span>Hello, User.</span></p>
                <p>How Can I Help You Today?</p>
            </div>
            <div className="cards">
                <div className="card" onClick={() => setPrompt("Suggest beautiful places to see on an upcoming road trip.")}>
                    <p className="card-text">Suggest beautiful places to see on an upcoming road trip.</p>
                    <p><Compass className="icons" color="#000000" /></p>
                </div>
                <div className="card" onClick={() => setPrompt("Briefly summarize this concept: urban planning")}>
                    <p className="card-text">Briefly summarize this concept: urban planning</p>
                    <p><Lightbulb className="icons" color="#000000" /></p>
                </div>
                <div className="card" onClick={() => setPrompt("Brainstrom team bonding activities for our work retreat.")}>
                    <p className="card-text">Brainstrom team bonding activities for our work retreat.</p>
                    <p><MessageSquare className="icons" color="#000000" /></p>
                </div>
                <div className="card" onClick={() => setPrompt("Improve the readability of the following code.")}>
                    <p className="card-text">Improve the readability of the following code.</p>
                    <p><SquareCode className="icons" color="#000000" /></p>
                </div>
            </div>
            </>}
            </div>
            {/* {result} */}
            <div className="main-bottom">
                <div className="search-box">
                    <input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a prompt here"/>
                    <div>
                        <p><Images color="#ffffff" /></p>
                        <p><Mic color="#ffffff" /></p>
                        <p onClick={sendPrompt}><SendHorizontal color="#ffffff" /></p>
                    </div>
                </div>
                <p className="bottom-info">ChatRAG may display inaccurate info, including about people, so double-check its responses.</p>
            </div>
        </div>
    </div>    
</div>
  );
}


