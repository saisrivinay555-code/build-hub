import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  routeAndGenerateResponse,
  ConversationContext
} from '../../services/constructionAI/intentRouter';
import { saveChatMessage } from '../../services/firebase/firestoreService.js';
import {
  X,
  Minus,
  Send,
  Bot,
  BarChart3,
  TrendingUp,
  FileText,
  DollarSign,
  Users,
  HelpCircle,
  Paperclip,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// RICH TEXT & MARKDOWN TABLE RENDERER
// Cleanly formats bold text, bullet points, and data tables
// inside chat bubbles without external dependencies.
// ─────────────────────────────────────────────────────────────
function renderFormattedContent(rawText) {
  if (!rawText) return null;

  const lines = rawText.split('\n');
  const blocks = [];
  let currentTable = null;
  let textBuffer = [];

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      blocks.push({ type: 'text', content: textBuffer.join('\n') });
      textBuffer = [];
    }
  };

  const flushTable = () => {
    if (currentTable && currentTable.rows.length > 0) {
      blocks.push({ type: 'table', headers: currentTable.headers, rows: currentTable.rows });
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.slice(1, -1).split('|').map(c => c.trim());
      // Check if it's markdown separator (| :--- | :--- |)
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      if (!currentTable) {
        flushTextBuffer();
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
    } else {
      flushTable();
      textBuffer.push(lines[i]);
    }
  }
  flushTable();
  flushTextBuffer();

  return (
    <div className="space-y-2">
      {blocks.map((block, bIdx) => {
        if (block.type === 'table') {
          return (
            <div key={bIdx} className="overflow-x-auto my-2 rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-semibold">
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} className="px-2.5 py-2 whitespace-nowrap">
                        <span dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-slate-50/50 hover:bg-blue-50/40' : 'hover:bg-blue-50/40'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-2.5 py-1.5 text-slate-600 text-[12px]">
                          <span dangerouslySetInnerHTML={{ __html: cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div key={bIdx} className="whitespace-pre-line leading-relaxed">
            {block.content.split('\n').map((l, lIdx) => {
              const htmlStr = l
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>');
              return (
                <div key={lIdx} dangerouslySetInnerHTML={{ __html: htmlStr || '&nbsp;' }} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function BuilderChatBot() {
  const {
    currentUser,
    myProjects,
    customerRequests,
    myCustomers,
    setCurrentTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentNotice, setAttachmentNotice] = useState(false);
  const messagesEndRef = useRef(null);

  // Multi-turn conversation context manager
  const contextRef = useRef(new ConversationContext());

  const builderName = currentUser?.name || 'A Sai Sri Vinay';
  const initialTime = '10:00 AM';

  // Initial welcome message matching reference UI exactly
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-1',
      sender: 'bot',
      time: initialTime,
      text: `Hello ${builderName}! 👋\nI'm your Build Hub AI Assistant.\n\nI can help you with:\n• Project progress and milestone updates\n• Customer inquiries and requests\n• Generate project reports\n• Manage multiple construction projects\n• Payment summaries and budgets\n• Document and approval status\n• Best practices for construction management\n• Any other builder-related questions\n\nHow can I help you today?`,
      showQuickActions: true
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const getCurrentTimeFormatted = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userTime = getCurrentTimeFormatted();
    const newUserMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: userTime
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    const safeUserId = currentUser?.email?.replace(/[^a-zA-Z0-9_]/g, '_') || 'builder_vinay';
    saveChatMessage({
      userId: safeUserId,
      role: 'Builder',
      sender: 'user',
      text: query
    });

    // Realistic typing delay for AI response
    setTimeout(() => {
      const response = routeAndGenerateResponse({
        message: query,
        builderName,
        myProjects,
        customerRequests,
        myCustomers,
        context: contextRef.current,
        setCurrentTab
      });

      const newBotMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.text,
        time: getCurrentTimeFormatted(),
        action: response.action,
        followUps: response.followUps
      };

      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);

      saveChatMessage({
        userId: safeUserId,
        role: 'Builder',
        sender: 'bot',
        text: response.text
      });
    }, 600);
  };

  const handleQuickAction = (actionTitle) => {
    if (actionTitle === 'Project Summary') {
      handleSendMessage('Show my ongoing projects and their progress');
    } else if (actionTitle === 'Update Progress') {
      handleSendMessage('How can I update project progress and milestones?');
    } else if (actionTitle === 'Generate Reports') {
      handleSendMessage('Generate project performance report');
    } else if (actionTitle === 'Payment & Budget') {
      handleSendMessage('Show my payment summaries and budgets');
    } else if (actionTitle === 'Manage Customers') {
      handleSendMessage('Manage customer inquiries and requests');
    } else if (actionTitle === 'Other Questions') {
      handleSendMessage('What other construction management assistance do you offer?');
    } else {
      handleSendMessage(actionTitle);
    }
  };

  const handleResetChat = () => {
    // Reset conversation context memory
    contextRef.current = new ConversationContext();
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'bot',
        time: getCurrentTimeFormatted(),
        text: `Hello ${builderName}! 👋\nI'm ready for your next request. How can I assist your construction planning or site operations today?`,
        showQuickActions: true
      }
    ]);
  };

  const quickActionsList = [
    { title: 'Project Summary', icon: BarChart3, color: 'text-blue-600' },
    { title: 'Update Progress', icon: TrendingUp, color: 'text-indigo-600' },
    { title: 'Generate Reports', icon: FileText, color: 'text-blue-500' },
    { title: 'Payment & Budget', icon: DollarSign, color: 'text-amber-600' },
    { title: 'Manage Customers', icon: Users, color: 'text-emerald-600' },
    { title: 'Other Questions', icon: HelpCircle, color: 'text-rose-500' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[9999] select-none">
      {/* ─── 1. CHAT WINDOW ───────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`flex flex-col bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden transition-all duration-300 ${
            isMinimized
              ? 'h-16 w-80 mb-2'
              : 'w-[92vw] sm:w-[420px] h-[620px] max-h-[86vh] mb-3'
          }`}
          style={{ boxShadow: '0 20px 45px -15px rgba(29, 78, 216, 0.28)' }}
        >
          {/* Header (Rich Royal Blue matching reference screenshot) */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight tracking-wide flex items-center gap-1.5">
                  Build Hub Assistant
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-xs text-blue-100 font-normal">
                  Your Builder Operations & Engineering Guide
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1 text-white/80">
              <button
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:bg-white/15 rounded-lg transition-colors hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70 text-slate-800 text-sm">
                {messages.map(msg => (
                  <div key={msg.id} className="space-y-2">
                    {msg.sender === 'bot' ? (
                      /* Bot Message Row */
                      <div className="flex items-start space-x-2.5 max-w-[94%]">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-slate-700 leading-relaxed text-[13px]">
                            {renderFormattedContent(msg.text)}
                          </div>

                          <div className="text-[11px] text-slate-400 mt-1 pl-1">
                            {msg.time}
                          </div>

                          {/* Quick Action Buttons (shown below initial welcome) */}
                          {msg.showQuickActions && (
                            <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
                              {quickActionsList.map(action => {
                                const IconComponent = action.icon;
                                return (
                                  <button
                                    key={action.title}
                                    onClick={() => handleQuickAction(action.title)}
                                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/70 text-slate-700 text-xs font-semibold shadow-xs transition-all text-left group"
                                  >
                                    <IconComponent className={`w-4 h-4 ${action.color} shrink-0 group-hover:scale-110 transition-transform`} />
                                    <span className="truncate">{action.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* Direct Action Link (e.g. Go to My Projects) */}
                          {msg.action && (
                            <button
                              onClick={() => {
                                if (msg.action.tab) setCurrentTab(msg.action.tab);
                              }}
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors"
                            >
                              <span>{msg.action.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Follow-up suggestions */}
                          {msg.followUps && msg.followUps.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {msg.followUps.map((fu, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSendMessage(fu)}
                                  className="text-[11.5px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200/80 transition-colors"
                                >
                                  {fu}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* User Message Row */
                      <div className="flex items-start justify-end space-x-2.5 ml-auto max-w-[85%]">
                        <div className="flex flex-col items-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm text-[13.5px] leading-relaxed">
                            {msg.text}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 pr-1">
                            {msg.time}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-300 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {builderName.charAt(0) || 'A'}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-2 text-slate-400 text-xs py-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2 flex items-center space-x-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attachment notice temporary banner */}
              {attachmentNotice && (
                <div className="bg-amber-50 border-t border-amber-200 px-3 py-1.5 text-xs text-amber-800 flex items-center justify-between">
                  <span>📎 File attachment simulated (BOQ / Blueprint / Site Photo ready)</span>
                  <button onClick={() => setAttachmentNotice(false)} className="text-amber-700 font-bold ml-2">×</button>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    placeholder="Type your message..."
                    className="w-full bg-transparent text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      setAttachmentNotice(true);
                      setTimeout(() => setAttachmentNotice(false), 3000);
                    }}
                    title="Attach site photo or document"
                    className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-all ${
                    inputMessage.trim()
                      ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                      : 'bg-blue-400 cursor-not-allowed opacity-75'
                  }`}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ─── 2. FLOATING LAUNCHER BUTTON ──────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white ring-4 ring-blue-500/20"
          style={{ boxShadow: '0 8px 25px -4px rgba(29, 78, 216, 0.6)' }}
          aria-label="Open Build Hub Assistant"
        >
          {/* Subtle glowing ring */}
          <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 pointer-events-none" />

          {/* Robot icon matching screenshot */}
          <Bot className="w-7 h-7 text-white drop-shadow group-hover:rotate-6 transition-transform" />

          {/* Active status indicator dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        </button>
      )}
    </div>
  );
}
