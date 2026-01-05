import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Yo! I\'m VTEC AI. Ask me about your build, engine codes, or stance setups. What are you driving?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_25px_rgba(216,0,13,0.6)] ${
          isOpen 
            ? 'bg-zinc-800 rotate-90 w-14 h-14 rounded-full' 
            : 'bg-gradient-to-br from-honda-red to-red-900 animate-pulse-fast w-16 h-16 rounded-full border-2 border-white/10'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <img 
            src="https://cdn.simpleicons.org/honda/ffffff" 
            alt="AI" 
            className="w-8 h-8 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] md:w-96 bg-zinc-950/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 h-[500px]' : 'scale-0 opacity-0 h-0'
        }`}
      >
        {/* Background Logo */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
             <img 
                src="https://cdn.simpleicons.org/honda/D8000D" 
                alt="Honda Background" 
                className="w-64 h-64 opacity-[0.07] transform -rotate-12 scale-150"
             />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 to-black p-4 border-b border-white/10 flex items-center gap-3 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-honda-red/10 animate-pulse"></div>
          <img src="https://cdn.simpleicons.org/honda/D8000D" alt="Logo" className="w-6 h-6 object-contain relative z-10" />
          <h3 className="font-display text-white font-bold tracking-wider relative z-10">VTEC AI ASSISTANT</h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-transparent z-10 relative">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm font-sans leading-relaxed shadow-lg backdrop-blur-sm ${
                  msg.role === 'user'
                    ? 'bg-honda-red/90 text-white rounded-br-none'
                    : 'bg-zinc-800/80 text-gray-200 rounded-bl-none border border-white/10'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="bg-zinc-800/80 p-3 rounded-lg rounded-bl-none border border-white/10 backdrop-blur-sm flex items-center gap-3">
                 <div className="relative">
                   <Loader2 className="animate-spin text-honda-red" size={22} />
                   <span className="absolute inset-0 blur-md bg-honda-red/40 rounded-full"></span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gray-200">AI IS TYPING</span>
                   <div className="flex gap-1 mt-1">
                     <span className="w-1.5 h-4 bg-honda-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-1.5 h-4 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                     <span className="w-1.5 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                   </div>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-zinc-900/90 border-t border-white/10 backdrop-blur-md z-10 relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about tuning, parts..."
              className="flex-1 bg-black/50 border border-white/20 rounded-md px-4 py-2 text-white text-sm focus:outline-none focus:border-honda-red transition-colors placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="p-2 bg-white/10 hover:bg-honda-red text-white rounded-md transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiAssistant;