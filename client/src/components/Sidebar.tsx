"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Bell,
  Cpu,
  Settings,
  ChartNoAxesCombined
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Sensor Data", icon: Database, href: "/sensors" },
  { name: "Alerts", icon: Bell, href: "/alerts" },
  { name: "Analytics", icon: ChartNoAxesCombined, href: "/analytics" },
  { name: "Device Status", icon: Cpu, href: "/devices" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex md:w-72 md:fixed md:inset-y-0 md:left-0 bg-white p-5 flex-col justify-between border-r border-gray-100/50 shadow-sm text-black">
        {/* Top */}
        <div>
          <Link href="/" aria-label="AgroSense AI Home" className="flex items-center gap-3 mb-10 mt-2 px-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
              <img
                src="/logo.png"
                alt="AgroSense AI"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent leading-none">AgroSense AI</h1>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase mt-1">Smart Farm IoT</span>
            </div>
          </Link>

          <Link href="/ai-assistant" className="w-full mb-6 block">
            <button className="w-full py-3 rounded-full bg-black text-white border-2 border-green-400 shadow-md hover:scale-105 transition">
              ✨ AI Assistant
            </button>
          </Link>

          <div className="space-y-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-green-50 text-green-700 font-bold"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <Icon size={22} className={`transition-colors ${isActive ? "text-green-600" : "text-gray-600 group-hover:text-black"}`} />
                  <span className="text-[15px] font-bold">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="space-y-4">
          <Link
            href="/settings"
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group ${pathname === "/settings"
              ? "bg-green-50 text-green-700 font-bold"
              : "text-gray-900 hover:bg-gray-50"
              }`}
          >
            <Settings size={22} className={`transition-colors ${pathname === "/settings" ? "text-green-600" : "text-gray-600 group-hover:text-black"}`} />
            <span className="text-[15px] font-bold">Settings</span>
          </Link>

          <div className="bg-gradient-to-br from-green-50 to-blue-50/50 p-4 rounded-2xl border border-green-100/50 flex items-center gap-3 shadow-sm">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100&h=100"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                alt="Farmer Profile"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="font-bold text-sm text-gray-900 truncate">Ramesh Kumar</p>
              <p className="text-[10px] text-gray-500 leading-none mt-1">Farmer / Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex justify-around items-center px-4 py-3 rounded-[2rem] z-50">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <Link
              key={i}
              href={item.href}
              className="flex flex-col items-center gap-1 transition-all active:scale-90"
            >
              <div className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 ${isActive ? "bg-green-600 text-white shadow-lg shadow-green-200" : "bg-transparent text-gray-400"}`}>
                <Icon size={20} />
              </div>
              <span
                className={`text-[11px] transition-all duration-300 ${isActive ? "font-black text-green-700" : "font-bold text-gray-900"}`}
              >
                {item.name === "Device Status" ? "Devices" : item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
