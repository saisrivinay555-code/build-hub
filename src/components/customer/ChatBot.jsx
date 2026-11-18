import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  routeAndGenerateCustomerResponse,
  CustomerConversationContext
} from '../../services/constructionAI/customerIntentRouter.js';
import { saveChatMessage } from '../../services/firebase/firestoreService.js';
import {
  X,
  Minus,
  Send,
  Bot,
  TrendingUp,
  CreditCard,
  FileText,
  CalendarDays,
  HardHat,
  HelpCircle,
  Paperclip,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// RICH TEXT & MARKDOWN TABLE RENDERER
// Cleanly formats bold text, bullet points, and data tables
// inside chat bubbles without external dependencies.
// ─────────────────────────────────────────────────────────
function renderMessageText(rawText) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'table') {
          return (
            <div
              key={bIdx}
              style={{
                overflowX: 'auto',
                margin: '8px 0',
                borderRadius: '12px',
                border: '1px solid #E9E5F5',
                background: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <table style={{ width: '100%', textAlign: 'left', fontSize: '11.5px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8F6FD', borderBottom: '1px solid #E9E5F5', color: '#4B5563', fontWeight: 600 }}>
                    {block.headers.map((h, hIdx) => (
                      <th key={hIdx} style={{ padding: '8px 10px', whiteSpace: 'nowrap' }}>
                        <span dangerouslySetInnerHTML={{ __html: h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      style={{
                        background: rIdx % 2 === 1 ? '#FAFAFD' : '#FFFFFF',
                        borderBottom: rIdx < block.rows.length - 1 ? '1px solid #F3F1FA' : 'none'
                      }}
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '7px 10px', color: '#374151' }}>
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
          <div key={bIdx} style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {block.content.split('\n').map((l, lIdx) => {
              // Blockquote / Tip styling
              if (l.startsWith('&gt;') || l.startsWith('>')) {
                const content = l.replace(/^(&gt;|>)\s*/, '');
                return (
                  <div
                    key={lIdx}
                    style={{
                      borderLeft: '3px solid #8B5CF6',
                      paddingLeft: '10px',
                      margin: '6px 0',
                      fontSize: '12px',
                      color: '#6B7280'
                    }}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              }

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

// ─────────────────────────────────────────────────────────
// CHATBOT COMPONENT
// ─────────────────────────────────────────────────────────
export default function ChatBot() {
  const {
    currentUser,
    customerProject,
    customerStages,
    customerPayments,
    customerDocuments,
    customerUpdates,
    setCurrentTab
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Multi-turn conversational context manager
  const contextRef = useRef(new CustomerConversationContext());

  const firstName = currentUser?.name?.split(' ')[0] || 'there';

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Initialize welcome message on first open
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!hasGreeted) {
      setHasGreeted(true);
      setMessages([
        {
          id: 'welcome',
          type: 'ai',
          text: `Hello ${firstName}! 👋\nI'm your **Build Hub AI Home Construction & Planning Advisor**.\n\nI can help you with:\n• 🏡 Planning your dream home & floor layouts\n• 💰 Turnkey construction cost estimation\n• 🧱 Comparing building materials & finishes\n• 📝 Evaluating builder quotations\n• 💳 Safe milestone payments & loan planning\n• 📊 Real-time updates on your **${customerProject?.name || 'Active Project'}**\n\nHow can I help you today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showQuickActions: true
        }
      ]);
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  // Send message logic
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const safeUserId = currentUser?.email?.replace(/[^a-zA-Z0-9_]/g, '_') || 'customer_ramesh';
    saveChatMessage({
      userId: safeUserId,
      role: 'Customer',
      sender: 'user',
      text: text.trim(),
      projectId: customerProject?.id
    });

    // Realistic AI processing delay
    const delay = 650 + Math.random() * 400;
    setTimeout(() => {
      const response = routeAndGenerateCustomerResponse({
        message: text,
        customerName: currentUser?.name || 'Ramesh Kumar',
        customerProject,
        customerStages,
        customerPayments,
        customerDocuments,
        customerUpdates,
        context: contextRef.current,
        setCurrentTab
      });

      const aiMsg = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        followUps: response.followUps || [],
        action: response.action || null
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);

      saveChatMessage({
        userId: safeUserId,
        role: 'Customer',
        sender: 'bot',
        text: response.text,
        projectId: customerProject?.id
      });
    }, delay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // Quick action mapping (Customer Homeowner focus)
  const quickActions = [
    { icon: TrendingUp, label: 'Track My Project', msg: 'What is my current project progress?' },
    { icon: HelpCircle, label: 'Plan Dream Home', msg: 'I have a 30×40 plot. Suggest a 3BHK house.' },
    { icon: CreditCard, label: 'Estimate Budget', msg: 'Estimate construction cost for a 1,500 sq. ft. house' },
    { icon: FileText, label: 'Compare Materials', msg: 'Which is better for my house: AAC blocks or red bricks?' },
    { icon: CalendarDays, label: 'Analyze Quotation', msg: 'My builder quoted ₹48 lakhs for a 1,800 sq. ft. house. Is that expensive?' },
    { icon: HardHat, label: 'Payment Guidance', msg: 'What should I check before paying my builder?' }
  ];

  const quickActionEmojis = ['📊', '🏡', '💰', '🧱', '📝', '💳'];

  // Reset conversation
  const resetChat = () => {
    // Reset conversation context memory
    contextRef.current = new CustomerConversationContext();
    setHasGreeted(false);
    setMessages([]);
    setIsTyping(false);
    handleOpen();
    setHasGreeted(true);
    setMessages([
      {
        id: 'welcome_reset',
        type: 'ai',
        text: `Hello ${firstName}! 👋\nI'm ready to help you plan or monitor your home construction.\n\nAsk me about plot planning, budgets, materials, builder quotes, or your active project!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showQuickActions: true
      }
    ]);
  };

  return (
    <>
      {/* ─── FLOATING CHATBOT BUTTON ─── */}
      {!isOpen && (
        <button
          id="chatbot-fab"
          onClick={handleOpen}
          aria-label="Open Build Hub AI Assistant"
          className="group"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            width: '62px',
            height: '62px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9333EA 0%, #6366F1 50%, #2563FF 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(147, 51, 234, 0.45), 0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'chatbot-pulse 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(147, 51, 234, 0.55), 0 4px 12px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(147, 51, 234, 0.45), 0 2px 8px rgba(0,0,0,0.15)';
          }}
        >
          {/* Bot Icon */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>

          {/* Notification Dot */}
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            background: '#00B981',
            borderRadius: '50%',
            border: '2.5px solid white',
            animation: 'chatbot-dot-pulse 2s infinite'
          }} />
        </button>
      )}

      {/* ─── MINIMIZED BAR ─── */}
      {isOpen && isMinimized && (
        <div
          onClick={handleRestore}
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            width: '320px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #4F46E5 100%)',
            borderRadius: '16px',
            padding: '14px 18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <Bot size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', fontSize: '13px', fontWeight: 700, margin: 0 }}>Build Hub Assistant</p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px', margin: 0 }}>Click to restore chat</p>
          </div>
          <ChevronDown size={18} color="rgba(255,255,255,0.7)" />
        </div>
      )}

      {/* ─── CHAT WINDOW ─── */}
      {isOpen && !isMinimized && (
        <div
          id="chatbot-window"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            zIndex: 9999,
            width: 'min(420px, calc(100vw - 24px))',
            height: 'min(620px, calc(100vh - 56px))',
            borderRadius: '20px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#FFFFFF',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
            animation: 'chatbot-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #4F46E5 100%)',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0
          }}>
            {/* Avatar */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              <Bot size={22} color="white" />
            </div>

            {/* Title */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: 'white',
                fontSize: '15px',
                fontWeight: 700,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                Build Hub AI Advisor
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34D399',
                  display: 'inline-block'
                }} />
              </h3>
              <p style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '11px',
                margin: '2px 0 0 0'
              }}>
                Home Planning & Construction Guide
              </p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={resetChat}
                title="Restart conversation"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleMinimize}
                title="Minimize"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Minus size={16} />
              </button>
              <button
                onClick={handleClose}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── Messages Body ── */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#F9FAFB'
          }}>
            {messages.map((msg) => {
              const isUser = msg.type === 'user';
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    {/* Bot avatar for AI messages */}
                    {!isUser && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        <Bot size={16} color="white" />
                      </div>
                    )}

                    <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {/* Bubble */}
                      <div style={{
                        background: isUser
                          ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)'
                          : '#FFFFFF',
                        color: isUser ? '#FFFFFF' : '#1F2937',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                        padding: '12px 15px',
                        fontSize: '13px',
                        lineHeight: '1.55',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        border: isUser ? 'none' : '1px solid #F0F0F5'
                      }}>
                        {isUser ? msg.text : renderMessageText(msg.text)}
                      </div>

                      {/* Quick Actions (only on welcome) */}
                      {msg.showQuickActions && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '6px',
                          marginTop: '4px'
                        }}>
                          {quickActions.map((qa, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(qa.msg)}
                              style={{
                                background: 'white',
                                border: '1.5px solid #E9E5F5',
                                borderRadius: '12px',
                                padding: '8px 10px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: '#6D28D9',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                                textAlign: 'left'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F5F3FF';
                                e.currentTarget.style.borderColor = '#C4B5FD';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#E9E5F5';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <span style={{ fontSize: '14px' }}>{quickActionEmojis[idx]}</span>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qa.label}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Navigation Action Button */}
                      {msg.action && (
                        <button
                          onClick={() => {
                            if (msg.action.tab) setCurrentTab(msg.action.tab);
                            handleClose();
                          }}
                          style={{
                            alignSelf: 'flex-start',
                            background: '#F5F3FF',
                            border: '1.5px solid #DDD6FE',
                            borderRadius: '10px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#6D28D9',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EDE9FE';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#F5F3FF';
                          }}
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {/* Follow-up suggestions */}
                      {msg.followUps && msg.followUps.length > 0 && (
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '5px',
                          marginTop: '2px'
                        }}>
                          {msg.followUps.map((fu, idx) => (
                            <button
                              key={idx}
                              onClick={() => sendMessage(fu)}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '14px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: '#4B5563',
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F3F4F6';
                                e.currentTarget.style.borderColor = '#9CA3AF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FFFFFF';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                              }}
                            >
                              {fu}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <span style={{
                        fontSize: '10px',
                        color: '#9CA3AF',
                        alignSelf: isUser ? 'flex-end' : 'flex-start',
                        padding: '0 4px'
                      }}>
                        {msg.time}
                      </span>
                    </div>

                    {/* User initial avatar */}
                    {isUser && (
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        background: '#E0E7FF', border: '1px solid #C7D2FE',
                        color: '#4338CA', fontWeight: 700, fontSize: '11px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        {firstName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={16} color="white" />
                </div>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '4px 16px 16px 16px',
                  padding: '10px 14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: '1px solid #F0F0F5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#8B5CF6', display: 'inline-block',
                    animation: 'chatbot-bounce 1.4s infinite ease-in-out',
                    animationDelay: '0s'
                  }} />
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#8B5CF6', display: 'inline-block',
                    animation: 'chatbot-bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.2s'
                  }} />
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: '#8B5CF6', display: 'inline-block',
                    animation: 'chatbot-bounce 1.4s infinite ease-in-out',
                    animationDelay: '0.4s'
                  }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar ── */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '12px 14px',
              background: '#FFFFFF',
              borderTop: '1px solid #F0F0F5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#F9FAFB',
              border: '1.5px solid #E5E7EB',
              borderRadius: '24px',
              padding: '6px 12px',
              transition: 'border-color 0.2s, box-shadow 0.2s'
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about planning, budgets, materials..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#1F2937'
                }}
              />
              <button
                type="button"
                title="Attach photo or quotation"
                onClick={() => {
                  alert('Attach file: You can upload your contractor quote or site photo.');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Paperclip size={16} />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              title="Send message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputValue.trim()
                  ? 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)'
                  : '#E5E7EB',
                border: 'none',
                color: 'white',
                cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
                boxShadow: inputValue.trim() ? '0 4px 12px rgba(124, 58, 237, 0.35)' : 'none'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
