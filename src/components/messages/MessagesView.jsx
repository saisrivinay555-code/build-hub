import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image as ImageIcon,
  CheckCheck,
  Search,
  MoreVertical,
  Phone,
  Video,
  Sparkles,
  Users,
  Building,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MessagesView() {
  const { chats, sendMessage, currentUser } = useApp();
  const [activeChatId, setActiveChatId] = useState(chats[0]?.id || 'chat1');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(activeChatId, inputText);
    const sentText = inputText;
    setInputText('');

    // Simulate realistic instant response from contractor/client
    setTimeout(() => {
      const responses = [
        'Acknowledged! The site team has recorded this in today\'s log.',
        'Photos and inspection checklists have been synced to the project file.',
        'Material delivery is currently on track as planned.',
        'Understood. We will have the foreman inspect this in the morning.'
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      sendMessage(activeChatId, randomResponse);
    }, 1400);
  };

  const handleQuickPrompt = (promptText) => {
    sendMessage(activeChatId, promptText);
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden h-[calc(100vh-140px)] flex flex-col md:flex-row">
      {/* Left Chat List Column */}
      <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <MessageSquare size={18} />
              </div>
              <h2 className="font-bold text-base text-[#1B2559]">Project Chats</h2>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              4 Active
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#F4F7FE] border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const lastMsg = chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                  isActive ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-gray-100/60'
                }`}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-11 h-11 rounded-xl object-cover ring-1 ring-gray-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                      {chat.name}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {lastMsg?.time || 'Today'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {lastMsg ? `${lastMsg.sender}: ${lastMsg.text}` : 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Active Chat Pane */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-200"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{activeChat.name}</h3>
                  <p className="text-[11px] text-gray-400 truncate max-w-xs sm:max-w-md">
                    {activeChat.participants.join(' • ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-2 hover:bg-gray-100 rounded-xl hover:text-blue-600 transition" title="Call">
                  <Phone size={17} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl hover:text-blue-600 transition" title="Video Site Inspection">
                  <Video size={17} />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F8FAFC]">
              {activeChat.messages.map((msg) => {
                const isMe = msg.isMe || msg.sender === currentUser.name;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      <span className="text-[11px] font-bold text-gray-700">{msg.sender}</span>
                      <span className="text-[10px] text-gray-400 font-medium">({msg.role})</span>
                    </div>

                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-[#1E60FF] text-white rounded-tr-xs'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 px-1">
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck size={12} className="text-blue-500" />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompt Chips */}
            <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" /> Quick Replies:
              </span>
              {[
                'Please share site photos',
                'Is the slab casting completed?',
                'Material arrived on site',
                'Inspection scheduled for 10 AM'
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleQuickPrompt(chip)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F4F7FE] text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition whitespace-nowrap border border-gray-200/80 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sendMessage(activeChatId, 'Attached: [Blueprint_V3_Approved.dwg]');
                }}
                className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                title="Attach Document / Blueprint"
              >
                <Paperclip size={18} />
              </button>

              <input
                type="text"
                placeholder="Type a message or update for construction stakeholders..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#F4F7FE] border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#1E60FF] hover:bg-blue-700 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition cursor-pointer"
                title="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Select a project channel to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
