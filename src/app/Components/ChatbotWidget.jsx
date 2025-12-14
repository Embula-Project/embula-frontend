'use client';
import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Embula Restaurant. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    "Make a reservation",
    "View menu",
    "Opening hours",
    "Contact info"
  ];

  const handleSendMessage = (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: getBotResponse(message),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('reservation') || msg.includes('book')) {
      return "I'd be happy to help you make a reservation! Please click here or visit our reservation page to book your table.";
    } else if (msg.includes('menu')) {
      return "You can view our full menu on the Menu page. We offer a wide variety of dishes from appetizers to desserts!";
    } else if (msg.includes('hours') || msg.includes('open')) {
      return "We're open Monday-Thursday: 11AM-10PM, Friday-Saturday: 11AM-11PM, and Sunday: 12PM-9PM.";
    } else if (msg.includes('contact') || msg.includes('phone') || msg.includes('address')) {
      return "You can reach us at +1 (555) 123-4567 or visit us at 123 Gourmet Street, Food City. Email: info@embula.com";
    } else {
      return "Thank you for your message! For specific inquiries, please feel free to call us at +1 (555) 123-4567 or make a reservation online.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 transform ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-amber-800/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="text-amber-600" size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold">Embula Assistant</h3>
                <p className="text-amber-100 text-xs">Online • Here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-200 border border-amber-800/30 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-amber-800/30 bg-black/30">
              <p className="text-xs text-gray-400 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(reply)}
                    className="text-xs bg-gray-800 hover:bg-amber-900/50 text-amber-300 px-3 py-1.5 rounded-full border border-amber-800/30 hover:border-amber-500/50 transition-all duration-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-amber-800/30 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full border border-amber-800/30 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-2 rounded-full hover:from-amber-500 hover:to-amber-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-full shadow-2xl hover:from-amber-500 hover:to-amber-400 transition-all duration-300 flex items-center justify-center group hover:scale-110 hover:shadow-amber-500/50"
      >
        {isOpen ? (
          <X size={28} className="transition-transform group-hover:rotate-90 duration-300" />
        ) : (
          <>
            <MessageCircle size={28} className="transition-transform group-hover:scale-110 duration-300" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
          </>
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="fixed bottom-6 right-24 z-40 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg border border-amber-800/30 animate-bounce">
          <p className="text-sm whitespace-nowrap">Need help? Chat with us!</p>
          <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-900"></div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
