"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  Send,
  Mic,
  Sparkles,
  Leaf,
  Droplets,
  Wind,
  BarChart3,
  User,
  Bot,
  History,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import { aiService } from "@/services/ai.service";
import { authService } from "@/services/auth.service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  { label: "Check soil moisture status", icon: <Droplets size={14} /> },
  { label: "Should I irrigate now?", icon: <Leaf size={14} /> },
  { label: "Analyze last 24h data", icon: <BarChart3 size={14} /> },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 160);
    el.style.height = `${next}px`;
  }, [input]);

  const handleSend = async (text: string = input) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    const userMsg: Message = {
      id: String(++messageIdRef.current),
      role: "user",
      content: cleanText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Get deviceId from service
      const user = authService.getCurrentUser();
      const deviceId = user?.deviceId;

      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      history.push({ role: "user", content: cleanText });

      const data = await aiService.chat(history, deviceId);

      const assistantMsg: Message = {
        id: String(++messageIdRef.current),
        role: "assistant",
        content: data.data.content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: String(++messageIdRef.current),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-dvh overflow-hidden">
        {/* --- Main Chat Section --- */}
        <div className="flex-1 flex flex-col bg-white md:border md:border-gray-100 md:rounded-3xl md:shadow-xl md:shadow-green-900/5 relative overflow-hidden rounded-none border-0">

          {/* Messages Area / Welcome Screen */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:p-6 space-y-4 md:space-y-6 overscroll-contain bg-gray-50">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-6 space-y-5"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-green-200 mb-1">
                  <Sparkles size={32} className="md:hidden" />
                  <Sparkles size={40} className="hidden md:block" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Welcome to AgroSense AI</h2>
                  <p className="text-sm md:text-base text-gray-500 font-medium max-w-md mx-auto">
                    Your intelligent companion for farm management. Ask me about your sensors, crop health, or irrigation schedules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-6 md:mt-8">
                  {[
                    { label: "Analyze soil health", desc: "Get detailed nutrient data" },
                    { label: "Irrigation plan", desc: "Optimize water usage" },
                    { label: "Weather alerts", desc: "Upcoming frost or heat" },
                    { label: "Crop diagnosis", desc: "Identify pest patterns" }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(item.label)}
                      className="p-4 bg-white/85 border border-gray-100 rounded-2xl text-left hover:border-green-500 hover:shadow-lg transition-all group"
                    >
                      <p className="text-sm font-bold text-gray-900 group-hover:text-green-600">{item.label}</p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[92%] sm:max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar Icons */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-white border border-gray-100 text-green-600'
                      }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* Bubble */}
                    <div className={`group relative p-4 rounded-2xl text-sm md:text-[15px] leading-relaxed ${msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-tr-none shadow-md'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                      }`}>
                      {msg.content.split('**').map((part, i) =>
                        i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-green-700'}>{part}</strong> : part
                      )}

                      <div className={`mt-2 text-[10px] font-medium opacity-50 flex items-center gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 text-green-600 flex items-center justify-center">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer (Sticky) */}
          <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur border-t border-gray-100 p-3 md:p-6 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            {/* Smart Suggestions Floating Above */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1 md:mx-0 md:px-0">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.label)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-full text-[11px] md:text-[11px] font-bold text-gray-600 hover:text-green-700 whitespace-nowrap transition-all"
                >
                  {sug.icon}
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Slack Input Box - Full Width on Mobile */}
            <div className="border border-gray-200 overflow-hidden focus-within:border-green-500 transition-all shadow-sm rounded-2xl md:rounded-xl bg-white">
              {/* Rich Text Toolbar (Visual Only) - Desktop only */}
              <div className="hidden md:flex items-center gap-1 p-2 bg-gray-50/50 border-b border-gray-100 overflow-x-auto no-scrollbar">
                {[
                  { icon: <Leaf size={14} />, title: "Bold" },
                  { icon: <Droplets size={14} />, title: "Italic" },
                  { icon: <Wind size={14} />, title: "Strikethrough" },
                  { icon: <BarChart3 size={14} />, title: "Link" },
                  { icon: <History size={20} />, title: "Number List" },
                  { icon: <Sparkles size={20} />, title: "Bullet List" },
                ].map((item, i) => (
                  <button key={i} title={item.title} className="p-2 hover:bg-white rounded text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                    {item.icon}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message AgroSense AI..."
                className="w-full bg-transparent px-4 py-3 text-[15px] leading-6 focus:outline-none resize-none min-h-11 max-h-40 text-gray-800 placeholder:text-gray-400"
                rows={1}
              />

              {/* Bottom Actions Area */}
              <div className="flex items-center justify-between p-2 bg-white">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"><Mic size={18} /></button>
                  <button className="hidden md:block p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"><Sparkles size={18} /></button>
                </div>

                <div className="flex items-center gap-2">
                  <p className="hidden md:block text-[10px] text-gray-400 font-medium px-2 italic">Shift + Enter for new line</p>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim()}
                    className={`flex items-center gap-2 px-5 py-2 md:py-1.5 rounded-lg font-bold text-xs md:text-sm transition-all ${input.trim()
                      ? 'bg-green-600 text-white shadow-md shadow-green-100 hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed'
                      }`}
                  >
                    Send
                    <Send size={14} className="md:w-3.5 md:h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
