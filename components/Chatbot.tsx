
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Search, BrainCircuit, Bot, User, Link as LinkIcon } from 'lucide-react';
import { getChatResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'Olá! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useGrounding, setUseGrounding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(input, useGrounding);
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      })).filter(s => s.uri);
      
      const botMessage: ChatMessage = {
        sender: 'bot',
        text: response.text,
        sources: sources,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const errorMessage: ChatMessage = {
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <Bot className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full flex-shrink-0" />}
              <div className={`max-w-md p-3 rounded-xl ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 border-t border-gray-600 pt-2">
                    <h4 className="text-xs font-semibold text-gray-400 mb-1">Sources:</h4>
                    <div className="flex flex-col gap-1">
                      {msg.sources.map((source, i) => (
                        <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1.5 truncate">
                           <LinkIcon size={12} /> {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {msg.sender === 'user' && <User className="w-8 h-8 p-1.5 bg-gray-600 text-white rounded-full flex-shrink-0" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Bot className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full flex-shrink-0 animate-pulse" />
              <div className="max-w-md p-3 rounded-xl bg-gray-800 text-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
                 <label htmlFor="grounding-toggle" className="flex items-center gap-2 cursor-pointer text-sm text-gray-400 hover:text-white">
                    <Search size={16} className={`${useGrounding ? 'text-green-400' : 'text-gray-500'}`} />
                    Enable Search Grounding
                </label>
                 <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="grounding-toggle" id="grounding-toggle" checked={useGrounding} onChange={() => setUseGrounding(!useGrounding)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label htmlFor="grounding-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
                </div>
                <style>{`.toggle-checkbox:checked { right: 0; border-color: #48bb78; } .toggle-checkbox:checked + .toggle-label { background-color: #48bb78; }`}</style>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={useGrounding ? "Ask about current events..." : "Ask anything..."}
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              <Send />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chatbot;
