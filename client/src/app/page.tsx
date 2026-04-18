"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
   Droplets,
   Thermometer,
   Wind,
   FlaskConical,
   CheckCircle2,
   AlertCircle,
   Clock,
   ArrowRight,
   Sparkles,
   Zap,
   Power
} from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { readingService } from "@/services/reading.service";

export default function Dashboard() {
   const [latestReading, setLatestReading] = useState<any>(null);
   const [history, setHistory] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<any>(null);

   useEffect(() => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser?.deviceId) {
         fetchData(currentUser.deviceId);
      } else {
         setLoading(false);
      }
   }, []);

   const fetchData = async (deviceId: string) => {
      try {
         const [latestRes, historyRes] = await Promise.all([
            readingService.getLatestReadings(deviceId),
            readingService.getHistory(deviceId)
         ]);
         setLatestReading(latestRes.data);
         setHistory(historyRes.data.slice(0, 3)); // Only show top 3 for insights
      } catch (err) {
         console.error("Failed to fetch dashboard data", err);
      } finally {
         setLoading(false);
      }
   };

   const sensorSummary = latestReading ? [
      { label: "Moisture", value: `${latestReading.soilMoisture.toFixed(1)}%`, icon: Droplets, color: "text-blue-600" },
      { label: "Temp", value: `${latestReading.temperature.toFixed(1)}°C`, icon: Thermometer, color: "text-orange-600" },
      { label: "Humidity", value: `${latestReading.humidity.toFixed(1)}%`, icon: Wind, color: "text-teal-600" },
      { label: "pH Level", value: `${latestReading.phValue.toFixed(1)}`, icon: FlaskConical, color: "text-purple-600" },
   ] : [
      { label: "Moisture", value: "--", icon: Droplets, color: "text-blue-600" },
      { label: "Temp", value: "--", icon: Thermometer, color: "text-orange-600" },
      { label: "Humidity", value: "--", icon: Wind, color: "text-teal-600" },
      { label: "pH Level", value: "--", icon: FlaskConical, color: "text-purple-600" },
   ];

   const insights = history.map((h, i) => ({
      id: i,
      title: `Reading recorded: ${h.temperature.toFixed(1)}°C, ${h.soilMoisture.toFixed(1)}% Moisture`,
      time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: <CheckCircle2 className="text-green-500" />
   }));

   if (loading) {
      return (
         <DashboardLayout>
            <div className="flex items-center justify-center h-full">
               <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
         </DashboardLayout>
      );
   }

   return (
      <DashboardLayout>
         <div className="flex flex-col gap-6 pb-10">

            {/* ================= 1. COMPACT HERO AI INSIGHT ================= */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               className="relative bg-linear-to-br from-green-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-green-100/50"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                     <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
                        <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">Welcome, {user?.name || 'Farmer'}</span>
                     </div>
                     <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                        Real-time monitoring for device <span className="underline decoration-yellow-400 decoration-2 underline-offset-4">{user?.deviceId || 'Unknown'}</span>
                     </h1>
                     <div className="flex flex-wrap items-center gap-3">
                        <button 
                           onClick={() => fetchData(user?.deviceId)}
                           className="px-6 py-3 bg-white text-green-700 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 group"
                        >
                           <Zap size={18} className="fill-green-600 text-green-600" />
                           Refresh Data
                        </button>
                     </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-inner">
                     <div className="flex flex-col">
                        <div className="text-[9px] font-black uppercase text-white/60 tracking-widest">Global Status</div>
                        <div className="text-3xl font-black text-white leading-tight">ACTIVE</div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* ================= 2. COMPACT ZONES & 3. SENSORS (Grid) ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

               {/* Left Column: Farm Zone Control (2/3 width) */}
               <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        Current Values
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     {sensorSummary.map((sensor, i) => (
                        <motion.div
                           key={i}
                           whileHover={{ y: -3 }}
                           className="bg-white rounded-2xl p-5 border border-gray-50 shadow-lg shadow-gray-100/30 flex flex-col gap-5 group cursor-default"
                        >
                           <div className="flex items-center justify-between">
                              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{sensor.label}</h3>
                              <div className={`p-2 rounded-xl bg-gray-50 group-hover:bg-green-50 transition-colors`}>
                                 <sensor.icon size={18} className={`${sensor.color}`} />
                              </div>
                           </div>
                           <div className="text-2xl font-black text-gray-900 leading-tight">{sensor.value}</div>
                        </motion.div>
                     ))}
                  </div>
               </div>

               {/* Right Column: Global Health & History (1/3 width) */}
               <div className="lg:col-span-4 space-y-4">
                  <h2 className="text-lg font-black text-gray-900 tracking-tight px-2">Global Health</h2>
                  <div className="bg-white rounded-3xl p-6 border border-gray-50 shadow-lg shadow-gray-100/30 flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-20 h-20 rounded-full border-8 border-green-500 border-t-transparent flex items-center justify-center">
                        <span className="text-xl font-black text-gray-900">92%</span>
                     </div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Crop Performance Index</p>
                  </div>
               </div>
            </div>

            {/* ================= 4. DECISION HISTORY & CONTROLLER (Bottom Row) ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

               <div className="lg:col-span-8">
                  <div className="bg-white rounded-3xl border border-gray-50 shadow-xl shadow-gray-100/30 overflow-hidden divide-y divide-gray-50">
                     <div className="p-4 px-6 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Recent Decisions</span>
                        <button className="text-[9px] font-black text-green-600 uppercase tracking-widest">History</button>
                     </div>
                     {insights.map((insight) => (
                        <div key={insight.id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                                 {insight.icon}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[13px] font-bold text-gray-800 leading-none">{insight.title}</span>
                                 <span className="text-[9px] text-gray-400 font-medium flex items-center gap-1 mt-1 uppercase tracking-tight">
                                    <Clock size={10} />
                                    {insight.time}
                                 </span>
                              </div>
                           </div>
                           <ArrowRight size={14} className="text-gray-200 group-hover:text-green-500 transition-colors" />
                        </div>
                     ))}
                  </div>
               </div>

               <div className="lg:col-span-4 self-start">
                  <div className="bg-gray-900 rounded-3xl p-5 text-white flex items-center justify-between shadow-xl shadow-gray-400/10 h-full">
                     <div className="flex flex-col">
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-0.5">Hardware</p>
                        <h3 className="text-md font-bold leading-tight">Node-32 Central</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-tight">Active</span>
                        </div>
                     </div>
                     <button className="p-3 bg-white/10 rounded-xl hover:bg-white hover:text-gray-900 transition-all">
                        <Power size={18} />
                     </button>
                  </div>
               </div>

            </div>

         </div>
      </DashboardLayout>
   );
}
