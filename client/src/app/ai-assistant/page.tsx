"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Send, 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  MoreHorizontal,
  Sparkles,
  Search,
  Sidebar as SidebarIcon,
  Smile,
  Image as ImageIcon,
  Link as LinkIcon,
  Info
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialMessages = [
  {
    id: 1,
    author: "AgroSense AI",
    avatar: "/logo.png",
    content: "Welcome to the AI Assistant. I can help you analyze your farm data, predict crop yields, or troubleshoot sensor issues. What's on your mind today?",
    time: "2h ago",
    votes: 42,
    isBot: true,
  },
  {
    id: 2,
    author: "Ramesh_Farmer",
    content: "Can you check why Soil Moisture in North Sector node-32 is regularly dropping below 30% during the afternoon?",
    time: "1h ago",
    votes: 3,
    isBot: false,
  },
  {
    id: 3,
    author: "AgroSense AI",
    avatar: "/logo.png",
    content: "Based on the last 48 hours of data, node-32 shows a high correlation between temperature spikes (reaching 34°C) and moisture loss. This suggests high evaporation due to either suboptimal mulch coverage or a possible leak in the drip irrigation line in that specific sector.",
    time: "45m ago",
    votes: 89,
    isBot: true,
  }
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMsg = {
      id: Date.now(),
      author: "Ramesh_Farmer",
      content: input,
      time: "Just now",
      votes: 1,
      isBot: false,
    };
    
    setMessages([...messages, newUserMsg]);
    setInput("");
    
    // Simulate bot response
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        author: "AgroSense AI",
        avatar: "/logo.png",
        content: "I'm processing your request using our specialized agriculture LLm model. I'll get back to you with a detailed analysis in a moment...",
        time: "Just now",
        votes: 0,
        isBot: true,
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1200px] mx-auto animate-in fade-in duration-500 pb-20">
        
        {/* ================= MAIN CHAT AREA (Reddit Style Feed) ================= */}
        <div className="flex-1 space-y-4">
          
          {/* Reddit-like Sort/Filter Bar */}
          <div className="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-4 px-4 sticky top-[80px] z-30 shadow-sm md:shadow-none">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              Agri-Feed
            </div>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['Hot', 'New', 'Top', 'Rising'].map((btn) => (
                <button key={btn} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${btn === 'Hot' ? 'bg-gray-100 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Message List */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-colors cursor-pointer flex group"
                >
                  {/* Upvote/Downvote Column */}
                  <div className="w-10 bg-gray-50/50 flex flex-col items-center py-2 gap-1 rounded-l-lg border-r border-gray-100">
                    <button className="text-gray-400 hover:text-orange-600 hover:bg-gray-200 p-0.5 rounded transition-all">
                      <ArrowBigUp size={24} />
                    </button>
                    <span className="text-xs font-bold text-gray-700">{msg.isBot && msg.votes === 0 ? "..." : msg.votes}</span>
                    <button className="text-gray-400 hover:text-blue-600 hover:bg-gray-200 p-0.5 rounded transition-all">
                      <ArrowBigDown size={24} />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 p-3 md:p-4 pr-10 relative">
                    <div className="flex items-center gap-2 mb-2">
                      {msg.isBot ? (
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center border border-green-100 overflow-hidden">
                          <img src="/logo.png" className="w-4 h-4 object-contain" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">RK</div>
                      )}
                      <span className={`text-[11px] font-bold ${msg.isBot ? 'text-green-700' : 'text-gray-900'}`}>
                        {msg.author}
                      </span>
                      <span className="text-[11px] text-gray-400">· {msg.time}</span>
                    </div>
                    
                    <div className="text-sm md:text-base text-gray-800 leading-relaxed font-medium">
                      {msg.content}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-4 flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 p-1.5 px-2 rounded font-bold text-xs transition-colors">
                        <MessageSquare size={16} />
                        <span>Reply</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 p-1.5 px-2 rounded font-bold text-xs transition-colors">
                        <Share2 size={16} />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:bg-gray-100 p-1.5 px-2 rounded font-bold text-xs transition-colors">
                        <LinkIcon size={16} />
                        <span>Copy URL</span>
                      </button>
                    </div>

                    <button className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 transition-colors p-1">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Reddit-like Input Box */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xl sticky bottom-4 z-40 transition-all focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/20">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white font-bold">RK</div>
               <span className="text-xs font-bold text-gray-500 italic">Posting as Ramesh_Farmer</span>
            </div>
            
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are your thoughts or farm questions?"
              className="w-full bg-gray-50/50 border border-transparent rounded-lg p-3 text-sm font-medium focus:outline-none focus:bg-white focus:border-gray-200 transition-all min-h-[100px] text-gray-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-gray-400">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Smile size={20} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ImageIcon size={20} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><LinkIcon size={20} /></button>
              </div>
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm tracking-tight shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center gap-2"
              >
                Comment
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= REDDIT SIDEBAR (About) ================= */}
        <div className="lg:w-[320px] space-y-4 shrink-0 hidden lg:block">
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
             <div className="h-10 bg-blue-500 w-full"></div>
             <div className="p-4 pt-0">
                <div className="flex items-center gap-3 -mt-5 mb-4">
                   <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 p-2 shadow-md">
                      <img src="/logo.png" className="w-full h-full object-contain" />
                   </div>
                   <h1 className="text-base font-bold text-gray-900 mt-4 tracking-tight">r/AgroSense_AI</h1>
                </div>
                
                <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6">
                  Advanced farm diagnostic and prediction engine. Powered by GPT-4 and IoT sensor data.
                </p>
                
                <div className="space-y-4 border-t border-gray-100 pt-4">
                   <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">2.5k</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Members</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                           <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                           12
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Online</span>
                      </div>
                   </div>
                   <button className="w-full py-2.5 bg-blue-600 text-white rounded-full font-bold text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-50">
                     Join Community
                   </button>
                </div>
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <Info size={14} />
                About Assistant
             </div>
             <div className="space-y-4">
                <div className="pb-4 border-b border-gray-50 flex flex-col gap-1">
                   <span className="text-xs font-bold text-gray-700 italic">Accuracy: 99.4%</span>
                   <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[99%]" />
                   </div>
                </div>
                <div className="flex flex-col gap-1">
                   <span className="text-xs font-bold text-gray-700">Capabilities:</span>
                   <ul className="text-[11px] text-gray-500 list-disc list-inside space-y-1 font-medium">
                      <li>Crop health analysis</li>
                      <li>Weather correlation</li>
                      <li>Sensor diagnostics</li>
                      <li>Irrigation scheduling</li>
                   </ul>
                </div>
             </div>
          </div>

          <div className="p-4 px-1 sticky top-[80px]">
             <div className="flex flex-wrap gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                <span>User Agreement</span>
                <span>Privacy Policy</span>
                <span>Content Policy</span>
                <span>Moderator Code of Conduct</span>
             </div>
             <p className="text-[10px] text-gray-400 mt-6 pt-4 border-t border-gray-100">
                AgroSense AI, Inc. © 2026. All rights reserved
             </p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
