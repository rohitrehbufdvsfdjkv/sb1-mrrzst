import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot } from 'lucide-react';
import ChatBot from './components/ChatBot';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const result = await ChatBot.getMedicalAdvice(input);
    setIsTyping(false);

    const botMessage: Message = { id: Date.now() + 1, text: result, sender: 'bot' };
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Medical Assistant</h1>
        <div className="mb-4 h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`rounded-full p-2 ${message.sender === 'user' ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    {message.sender === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-gray-700" />}
                  </div>
                  <div className={`max-w-xs mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-indigo-100 text-indigo-900' : 'bg-white text-gray-800'}`}>
                    {message.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-gray-200 p-3 rounded-lg">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center border-2 border-indigo-200 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-indigo-300 transition-all duration-300">
            <MessageCircle className="text-indigo-400 ml-3" size={20} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your medical concern..."
              className="flex-grow p-3 outline-none"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-500 text-white p-3 hover:bg-indigo-600 transition-colors"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default App;