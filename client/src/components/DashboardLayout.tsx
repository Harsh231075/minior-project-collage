"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AIFloatingButton from "./AIFloatingButton";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAIAssistant = pathname === '/ai-assistant';

  return (
    <div className="flex bg-gray-50 min-h-dvh font-sans selection:bg-green-100 selection:text-green-900 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 bg-[#F9FBFA] md:ml-72 relative transition-all duration-300 ease-in-out ${isAIAssistant
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
        <div className={`${isAIAssistant ? 'px-0 md:px-8 pb-0 pt-0' : 'px-4 md:px-8 pb-32 md:pb-10 pt-4 md:pt-6'} space-y-6`}>
          <div className={`${isAIAssistant ? 'max-w-6xl' : 'max-w-7xl'} mx-auto w-full`}>
            {children}
          </div>
        </div>

        {/* Premium AI FAB - Hidden on AI Assistant page */}
        {!isAIAssistant && <AIFloatingButton />}
      </main>
    </div>
  );
}
