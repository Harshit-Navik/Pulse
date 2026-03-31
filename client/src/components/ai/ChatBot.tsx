import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bot,
  X,
  Send,
  User,
  Minimize2,
  MessageCircle,
  Dumbbell,
  Utensils,
  Zap,
} from 'lucide-react';

/* ─── Types ─── */
interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isFallback?: boolean;
}

interface HistoryEntry {
  role: 'user' | 'assistant';
  text: string;
}

/* ─── Helpers ─── */
const generateId = () => Math.random().toString(36).substring(2, 9);

const QUICK_PROMPTS = [
  { icon: Dumbbell, label: 'Best chest workout?', query: 'What are the best chest exercises for muscle growth?' },
  { icon: Utensils, label: 'High-protein meal?', query: 'Suggest a quick high-protein meal I can make in 15 mins.' },
  { icon: Zap, label: 'Fat loss tips?', query: 'Give me 3 proven tips for faster fat loss.' },
];

const SYSTEM_PROMPT = `You are PULSE AI Coach — a professional fitness and nutrition expert built into the Pulse fitness app.
Your role: Help users with gym workouts, fat loss, muscle gain, diet plans, and wellness.
Tone: Motivational, direct, practical. Like a personal trainer texting their client.
Format: Use short paragraphs or bullet points. Keep answers action-oriented and easy to follow.
Constraints: Only answer fitness, gym, diet, nutrition, and wellness questions. For off-topic queries, politely redirect to fitness topics.`;

/* ─── API call ─── */
async function sendMessage(message: string, history: HistoryEntry[]): Promise<string> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      systemPrompt: SYSTEM_PROMPT,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (err.reply) return err.reply;
    throw new Error('Network error');
  }

  const data = await response.json();
  return data.reply || 'Sorry, I could not generate a response.';
}

/* ─── Main Component ─── */
export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasGreeted, setHasGreeted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const historyRef = useRef<HistoryEntry[]>([]);

  /* ── Auto-scroll ── */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* ── Focus input when panel opens ── */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  /* ── Greet on first open ── */
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      setHasGreeted(true);
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: generateId(),
            role: 'bot',
            text: "Hey! I'm your **PULSE AI Coach**. Ask me anything about workouts, diet plans, fat loss, muscle gain, or wellness. Let's get to work! 💪",
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 800);
    }
  }, [isOpen, hasGreeted, messages.length]);

  /* ── Send message ── */
  const handleSend = useCallback(async () => {
    const value = input.trim();
    if (!value || isTyping) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text: value,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const currentHistory = [...historyRef.current];
    historyRef.current = [...currentHistory, { role: 'user', text: value }];

    try {
      const reply = await sendMessage(value, currentHistory);

      const botMsg: ChatMessage = {
        id: generateId(),
        role: 'bot',
        text: reply,
        timestamp: new Date(),
      };

      historyRef.current = [...historyRef.current, { role: 'assistant', text: reply }];
      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen || isMinimized) {
        setUnreadCount((c) => c + 1);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'bot',
          text: "⚠️ I couldn't reach the server. Please make sure the Pulse backend is running on port 5000.",
          timestamp: new Date(),
          isFallback: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, isOpen, isMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (query: string) => {
    setInput(query);
    setTimeout(() => handleSendDirect(query), 50);
  };

  const handleSendDirect = async (text: string) => {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const currentHistory = [...historyRef.current];
    historyRef.current = [...currentHistory, { role: 'user', text }];

    try {
      const reply = await sendMessage(text, currentHistory);
      historyRef.current = [...historyRef.current, { role: 'assistant', text: reply }];
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: 'bot', text: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'bot',
          text: "⚠️ Server unreachable. Please make sure the backend is running.",
          timestamp: new Date(),
          isFallback: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  /* ── Render message text with basic bold/newline support ── */
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
          {i < text.split('\n').length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* ── Floating Chat Panel ── */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed bottom-[168px] sm:bottom-[224px] right-4 sm:right-12 z-[200] flex flex-col"
            style={{
              width: 'min(420px, calc(100vw - 2rem))',
              height: 'min(600px, calc(100vh - 8rem))',
              background: '#0E0E0E',
              border: '1px solid #2A2A2A',
              borderRadius: '0',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,59,59,0.06)',
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: '1px solid #2A2A2A',
                background: 'linear-gradient(135deg, #1A1A1A 0%, #0E0E0E 100%)',
              }}
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-9 h-9 flex items-center justify-center"
                    style={{ background: 'rgba(255,59,59,0.12)', border: '1px solid rgba(255,59,59,0.2)' }}
                  >
                    <Bot className="w-4 h-4" style={{ color: '#FF3B3B' }} />
                  </div>
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: '#22c55e', borderColor: '#0E0E0E' }}
                  />
                </div>
                <div>
                  <p
                    className="text-xs font-black uppercase tracking-[0.18em]"
                    style={{ color: '#F2F2F2', fontFamily: 'Manrope, sans-serif' }}
                  >
                    PULSE AI Coach
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p
                      className="text-[9px] font-bold uppercase tracking-widest"
                      style={{ color: '#8C8C8C' }}
                    >
                      Online · Fitness Expert
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleMinimize}
                  className="w-8 h-8 flex items-center justify-center transition-colors"
                  style={{ color: '#8C8C8C' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F2F2F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8C8C')}
                  title="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center transition-colors"
                  style={{ color: '#8C8C8C' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF3B3B')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8C8C8C')}
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,59,59,0.025) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'bot' && (
                      <div
                        className="w-7 h-7 flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.15)' }}
                      >
                        <Bot className="w-3.5 h-3.5" style={{ color: '#FF3B3B' }} />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div
                        className="px-4 py-3 text-xs leading-relaxed"
                        style={
                          msg.role === 'user'
                            ? {
                              background: '#FF3B3B',
                              color: '#FFFFFF',
                              fontWeight: 500,
                            }
                            : {
                              background: '#1A1A1A',
                              border: `1px solid ${msg.isFallback ? 'rgba(255,59,59,0.3)' : '#2A2A2A'}`,
                              color: '#F2F2F2',
                              fontWeight: 300,
                            }
                        }
                      >
                        {renderText(msg.text)}
                      </div>
                      <span
                        className="text-[8px] font-medium uppercase tracking-widest px-1"
                        style={{ color: '#8C8C8C' }}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.role === 'user' && (
                      <div
                        className="w-7 h-7 flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: '#201F1F', border: '1px solid #2A2A2A' }}
                      >
                        <User className="w-3.5 h-3.5" style={{ color: '#8C8C8C' }} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5 items-start"
                  >
                    <div
                      className="w-7 h-7 flex-shrink-0 flex items-center justify-center"
                      style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.15)' }}
                    >
                      <Bot className="w-3.5 h-3.5" style={{ color: '#FF3B3B' }} />
                    </div>
                    <div
                      className="px-4 py-3 flex items-center gap-1.5"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: 'rgba(255,59,59,0.6)' }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick prompts — show only when no messages beyond greeting */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 pt-2"
                >
                  <p
                    className="text-[9px] font-black uppercase tracking-widest px-1"
                    style={{ color: '#8C8C8C' }}
                  >
                    Quick Ask
                  </p>
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleQuickPrompt(p.query)}
                      disabled={isTyping}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-left transition-all disabled:opacity-50"
                      style={{
                        background: '#1A1A1A',
                        border: '1px solid #2A2A2A',
                        color: '#8C8C8C',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,59,59,0.4)';
                        e.currentTarget.style.color = '#FF3B3B';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#2A2A2A';
                        e.currentTarget.style.color = '#8C8C8C';
                      }}
                    >
                      <p.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">{p.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div
              className="flex-shrink-0 px-4 py-3"
              style={{ borderTop: '1px solid #2A2A2A', background: '#0E0E0E' }}
            >
              <div
                className="flex items-end gap-2"
                style={{ border: '1px solid #2A2A2A', background: '#1A1A1A', padding: '2px 2px 2px 14px' }}
              >
                <textarea
                  ref={inputRef}
                  id="floating-chatbot-input"
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your coach…"
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-xs resize-none outline-none py-3 disabled:opacity-50"
                  style={{
                    color: '#F2F2F2',
                    minHeight: '20px',
                    maxHeight: '100px',
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.5',
                    caretColor: '#FF3B3B',
                  }}
                />
                <button
                  id="floating-chatbot-send"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#FF3B3B', color: '#FFFFFF' }}
                  onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.filter = 'brightness(1.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p
                className="text-[8px] font-medium uppercase tracking-widest text-center mt-2"
                style={{ color: '#353534' }}
              >
                Pulse AI · Fitness & Wellness Only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized pill ── */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            key="minimized-pill"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-[96px] sm:bottom-[136px] right-6 sm:right-12 z-[200] flex items-center gap-3 px-4 py-3 transition-all rounded-sm"
            style={{
              background: '#0E0E0E',
              border: '1px solid rgba(255,59,59,0.3)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,59,59,0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,59,59,0.3)'; }}
          >
            <Bot className="w-4 h-4" style={{ color: '#FF3B3B' }} />
            <span
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: '#F2F2F2' }}
            >
              PULSE AI Coach
            </span>
            {unreadCount > 0 && (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: '#FF3B3B', color: '#FFFFFF' }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="fab"
            id="chatbot-fab"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={handleOpen}
            className="fixed bottom-[96px] right-6 sm:bottom-[136px] sm:right-12 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all group rounded-sm z-[200]"
            style={{
              background: 'linear-gradient(135deg, #FF3B3B 0%, #cc2020 100%)',
              boxShadow: '0 8px 32px rgba(255,59,59,0.4), 0 0 0 0 rgba(255,59,59,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,59,59,0.55), 0 0 0 4px rgba(255,59,59,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,59,59,0.4), 0 0 0 0 rgba(255,59,59,0.3)';
            }}
            title="Chat with PULSE AI Coach"
          >
            {/* Pulse ring animation */}
            <motion.span
              className="absolute inset-0 rounded-sm"
              animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{ background: 'rgba(255,59,59,0.25)', pointerEvents: 'none' }}
            />

            <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black"
                style={{ background: '#FFFFFF', color: '#FF3B3B', border: '2px solid #FF3B3B' }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
