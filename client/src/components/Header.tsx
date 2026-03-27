"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const getPageTitle = () => {
    switch (pathname) {
      case "/": return "Dashboard";
      case "/sensors": return "Sensor Records";
      case "/alerts": return "System Alerts";
      case "/analytics": return "Data Analytics";
      case "/devices": return "Device Status";
      case "/ai-assistant": return "AI Assistant Hub";
      default: return "AgroSense AI";
    }
  };

  const getPageDescription = () => {
    switch (pathname) {
      case "/": return "Welcome back, Farmer Ramesh. Here's your smart farm overview.";
      case "/sensors": return "View and manage historical records from all your IoT nodes.";
      case "/alerts": return "Monitor critical warnings and active system alerts.";
      case "/analytics": return "Deep insights and historical trends from your sensor network.";
      case "/devices": return "Manage your hardware nodes, gateways, and pair new devices.";
      case "/ai-assistant": return "Interact with specialized agricultural AI models.";
      default: return "Smart IOT Monitoring System";
    }
  };

  return (
    <header className="flex items-center justify-between p-4 md:p-6 bg-white/70 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100/50 rounded-2xl md:rounded-3xl shadow-sm mb-6">
      {/* Left - Page Title */}
      <div className="flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h1>
        <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-0.5">{getPageDescription()}</p>
      </div>

      {/* Right - Profile & Notifications */}
      <div className="flex items-center gap-3 md:gap-5">
        <button className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100 flex items-center justify-center relative shadow-sm">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <button className="hidden md:flex items-center gap-2 p-1.5 pr-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-green-200 transition-all">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
            <span className="text-xs">RK</span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold text-gray-900">Ramesh Kumar</span>
            <span className="text-[10px] text-gray-400">Farmer Admin</span>
          </div>
        </button>

        <button className="md:hidden w-10 h-10 rounded-xl overflow-hidden shadow-md active:scale-95 transition-all">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100&h=100"
            className="w-full h-full object-cover"
            alt="Profile"
          />
        </button>
      </div>
    </header>
  );
}
