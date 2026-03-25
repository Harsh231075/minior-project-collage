"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AIFloatingButton from "./AIFloatingButton";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans selection:bg-green-100 selection:text-green-900 transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-[#F9FBFA] overflow-y-auto md:ml-72 min-h-screen relative transition-all duration-300 ease-in-out">
        {/* Sticky Header Section */}
        <div className="px-4 md:px-8 pt-4 md:pt-6 sticky top-0 z-40 bg-transparent">
          <Header />
        </div>

        {/* Dashboard Content Container */}
        <div className="px-4 md:px-8 pb-32 md:pb-10 pt-4 md:pt-6 space-y-6 md:space-y-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>

        {/* Premium AI FAB */}
        <AIFloatingButton />
      </main>
    </div>
  );
}
