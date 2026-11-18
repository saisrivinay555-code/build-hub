import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Phone, User, CheckCheck, Paperclip, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CustomerMessagesView() {
  const { customerProject, customerMessages, sendCustomerMessage, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [customerMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendCustomerMessage(inputText);
    setInputText('');
  };

  const quickQuestions = [
    'When will the false ceiling work finish?',
    'Can I inspect the electrical wiring tomorrow?',
    'Please share the bathroom tile layout options.',
    'Is the next milestone payment due on Aug 20?'
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#071739] to-[#0d2757] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={customerProject.builderAvatar}
              alt={customerProject.builderName}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-400"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#071739]" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-none">{customerProject.builderName}</h3>
            <p className="text-[11px] text-blue-200 mt-1 flex items-center gap-1">
              <span>Site Lead Contractor • Residential Villa</span>
            </p>
          </div>
        </div>

        <a
          href={`tel:${customerProject.builderContact}`}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Phone size={14} />
          <span className="hidden sm:inline">Call Builder</span>
        </a>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F8FAFC]">
        <div className="text-center">
          <span className="text-[11px] font-bold text-gray-400 bg-gray-200/60 px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Project Communication Channel
          </span>
        </div>

        {customerMessages.map((msg) => {
          const isMe = msg.sender === 'customer';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={customerProject.builderAvatar}
                  alt="Builder"
                  className="w-7 h-7 rounded-full object-cover mb-1"
                />
              )}

              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-xs ${
                  isMe
                    ? 'bg-[#1E60FF] text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className={`text-[10px] font-bold ${isMe ? 'text-blue-200' : 'text-purple-600'}`}>
                    {msg.senderName}
                  </span>
                  <span className={`text-[10px] ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Chips */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold text-gray-400 uppercase shrink-0">Quick Ask:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendCustomerMessage(q)}
            className="px-2.5 py-1 bg-white hover:bg-purple-50 text-gray-700 hover:text-purple-700 text-[11px] font-semibold rounded-lg border border-gray-200 whitespace-nowrap transition cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-gray-200 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to Tech Builders..."
          className="flex-1 bg-[#F4F7FE] border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 font-medium"
        />
        <button
          type="submit"
          className="p-3 bg-[#092257] hover:bg-[#07183d] text-white rounded-2xl transition shadow-md cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
