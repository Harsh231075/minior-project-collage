"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-32 right-6 z-[100] md:bottom-12 md:right-12 select-none">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="hidden md:block absolute bottom-full right-0 mb-4 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-2xl pointer-events-none"
          >
            Ask AI Assistant
            <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link href="/ai-assistant">
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          className="relative group flex items-center justify-center focus:outline-none"
        >
          {/* Outer Glow Layer */}
          <div className={`absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-70 ${isHovered ? 'animate-pulse' : ''}`}></div>

          {/* Main Button Body - Responsive Sizing */}
          <div className="relative w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(16,185,129,0.3)] border-4 border-white/20 overflow-hidden">

            {/* Animated Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

            {/* Particles (Mobile Subtle) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-2 left-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-1/2 left-2 w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"></div>
            </div>

            {/* Sparkle Icon - Responsive Size */}
            <div className="relative z-10 text-white">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]" />
            </div>

            {/* Orbiting Border */}
            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-500"></div>
          </div>

          {/* Top-right "AI" Badge - Compact on Mobile */}
          <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce ring-2 ring-emerald-100">
            <span className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase">AI</span>
          </div>
        </motion.button>
      </Link>
    </div>
  );
}
