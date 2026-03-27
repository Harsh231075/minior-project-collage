"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AIFloatingButton from "./AIFloatingButton";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic Client-Side Auth Check
    const user = localStorage.getItem("agrosense_user");
    
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const isAIAssistant = pathname === '/ai-assistant';

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F9FBFA]">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-dvh font-sans selection:bg-green-100 selection:text-green-900 transition-colors duration-300 ${isAIAssistant ? 'bg-white' : 'bg-gray-50'}`}>
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 ${isAIAssistant ? 'bg-white' : 'bg-[#F9FBFA]'} md:ml-72 relative transition-all duration-300 ease-in-out ${isAIAssistant
          ? 'h-dvh overflow-hidden'
          : 'min-h-screen overflow-y-auto'
          }`}
      >
        {/* Sticky Header Section - Hidden on AI Assistant page */}
        {!isAIAssistant && (
          <div className="px-4 md:px-8 pt-4 md:pt-6 sticky top-0 z-40 bg-transparent">
            <Header />
          </div>
        )}

        {/* Dashboard Content Container - Adjusted for AI Assistant Hub - No horizontal padding on mobile */}
        <div
          className={`${isAIAssistant
            ? 'h-full px-0 md:px-4 pb-0 pt-0'
            : 'px-4 md:px-8 pb-32 md:pb-10 pt-4 md:pt-6'
            } space-y-6`}
        >
          <div
            className={`${isAIAssistant
              ? 'w-full h-full max-w-none'
              : 'max-w-7xl mx-auto w-full'
              }`}
          >
            {children}
          </div>
        </div>

        {/* Premium AI FAB - Hidden on AI Assistant page */}
        {!isAIAssistant && <AIFloatingButton />}
      </main>
    </div>
  );
}
