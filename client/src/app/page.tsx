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

const zones = [
  { id: "Zone A", status: "Good", moisture: 42, temp: 28, color: "bg-green-500" },
  { id: "Zone B", status: "Warning", moisture: 31, temp: 31, color: "bg-yellow-500" },
  { id: "Zone C", status: "Critical", moisture: 18, temp: 34, color: "bg-red-500" },
];

const insights = [
  { id: 1, title: "Rain detected in North Sector", time: "10m ago", icon: <AlertCircle className="text-blue-500" /> },
  { id: 2, title: "Zone C temperature spike (+4°C)", time: "45m ago", icon: <AlertCircle className="text-red-500" /> },
  { id: 3, title: "Irrigation completed for Zone A", time: "2h ago", icon: <CheckCircle2 className="text-green-500" /> },
];

const sensorSummary = [
  { label: "Moisture", value: "35%", icon: Droplets, color: "text-blue-600" },
  { label: "Temp", value: "29°C", icon: Thermometer, color: "text-orange-600" },
  { label: "Humidity", value: "65%", icon: Wind, color: "text-teal-600" },
  { label: "pH Level", value: "6.8", icon: FlaskConical, color: "text-purple-600" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-10">
        
        {/* ================= 1. COMPACT HERO AI INSIGHT ================= */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-br from-green-600 to-teal-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-green-100/50"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
                <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">AI ACTION MGR</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-snug">
                Low moisture in Zone C. Irrigation <span className="underline decoration-yellow-400 decoration-2 underline-offset-4">recommended</span> for 15 mins.
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-6 py-3 bg-white text-green-700 rounded-xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 group">
                   <Zap size={18} className="fill-green-600 text-green-600" />
                   Start Now
                </button>
                <button className="px-6 py-3 text-white/80 font-bold text-sm hover:text-white transition-all">
                   Dismiss
                </button>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-inner">
               <div className="flex flex-col">
                  <div className="text-[9px] font-black uppercase text-white/60 tracking-widest">Confidence</div>
                  <div className="text-3xl font-black text-white leading-tight">94%</div>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="flex flex-col">
                  <div className="text-[9px] font-black uppercase text-white/60 tracking-widest">Savings</div>
                  <div className="text-xl font-black text-emerald-300 leading-tight">+$12.40</div>
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
                    Zone Status
                 </h2>
                 <button className="text-[10px] font-black text-green-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 transition-all">
                   View Map
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {zones.map((zone, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl p-5 border border-gray-50 shadow-lg shadow-gray-100/30 flex flex-col gap-5 group cursor-default"
                  >
                    <div className="flex items-center justify-between">
                       <h3 className="text-md font-black text-gray-900 tracking-tight">{zone.id}</h3>
                       <div className={`w-8 h-8 ${zone.color} rounded-lg flex items-center justify-center shadow-md`}>
                          <Droplets className="text-white fill-white/10" size={16} />
                       </div>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Moisture</span>
                          <span className="text-sm font-black text-gray-900">{zone.moisture}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <div className={`h-full ${zone.color}`} style={{ width: `${zone.moisture}%` }}></div>
                       </div>
                       <div className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-400 font-bold uppercase tracking-tighter">Status</span>
                          <span className={`font-black ${
                            zone.status === 'Good' ? 'text-green-600' : 
                            zone.status === 'Warning' ? 'text-orange-500' : 'text-red-500'
                          }`}>{zone.status}</span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           {/* Right Column: Global Health & History (1/3 width) */}
           <div className="lg:col-span-4 space-y-4">
              <h2 className="text-lg font-black text-gray-900 tracking-tight px-2">Global Health</h2>
              <div className="grid grid-cols-2 gap-3">
                 {sensorSummary.map((sensor, i) => (
                   <div key={i} className="bg-white rounded-2xl p-4 border border-gray-50 shadow-md shadow-gray-100/20 flex flex-col gap-2 group">
                      <div className={`p-2 rounded-xl bg-gray-50 group-hover:bg-green-50 w-fit transition-colors`}>
                         <sensor.icon size={18} className={`${sensor.color}`} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{sensor.label}</span>
                         <span className="text-lg font-black text-gray-900 leading-tight">{sensor.value}</span>
                      </div>
                   </div>
                 ))}
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
