import React, { useState } from 'react';
import { MessageCircle, X, Send, Volume2 } from 'lucide-react';
import { chatAI } from "../services/api";

export default function AIAssistant({ context }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", text: userQ }]);
    setIsLoading(true);

    try {
      const answer = await chatAI(userQ, context);
      setMessages(prev => [...prev, { role: "ai", text: answer }]);
      
      // Text-To-Speech
      const utterance = new SpeechSynthesisUtterance(answer);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 100 }}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageCircle size={30} />
        </button>
      ) : (
        <div style={{
          width: '320px', height: '400px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)'
        }}>
          <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} /> Travel Assistant
            </h3>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.length === 0 && (
              <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '13px', marginTop: '20px' }}>
                Ask me about {context || "financial tips"}!
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                background: msg.role === 'user' ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                padding: '10px 14px', borderRadius: '12px', maxWidth: '85%', fontSize: '14px',
                lineHeight: '1.4'
              }}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', color: 'var(--muted)', fontSize: '13px' }}>
                Typing...
              </div>
            )}
          </div>
          
          <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px', color: 'var(--text)'
              }}
            />
            <button type="submit" disabled={isLoading || !question.trim()} style={{
              background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px',
              padding: '0 15px', cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
