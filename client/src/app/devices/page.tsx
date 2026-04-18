"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { 
  Cpu, 
  Settings, 
  RefreshCcw, 
  Activity, 
  Wifi, 
  Battery, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import { motion, AnimatePresence } from "framer-motion";

export default function DevicesPage() {
  const [user, setUser] = useState<any>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const sensors = [
    { name: "Soil Moisture Sensor", status: "Healthy", type: "Analog", health: 98 },
    { name: "DHT22 (Temp & Humidity)", status: "Healthy", type: "Digital", health: 100 },
    { name: "pH Value Probe", status: "Check Needed", type: "Analog", health: 72 },
    { name: "Rain Detection Module", status: "Healthy", type: "Digital", health: 100 },
  ];

  const handleToggleMonitoring = async () => {
    if (!user || isUpdating) return;
    setIsUpdating(true);
    try {
      const nextStatus = !user.isMonitoringActive;
      const res = await userService.updateSettings(user.id, { isMonitoringActive: nextStatus });
      if (res.ok) {
        const updatedUser = { ...user, isMonitoringActive: nextStatus };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to toggle monitoring", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReplace = async () => {
    if (!user || !newDeviceId.trim()) return;
    setIsUpdating(true);
    try {
      const res = await userService.updateSettings(user.id, { deviceId: newDeviceId });
      if (res.ok) {
        const updatedUser = { ...user, deviceId: newDeviceId };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsReplacing(false);
        setNewDeviceId("");
      }
    } catch (err) {
      console.error("Failed to replace device", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Device Management</h1>
            <p className="text-gray-500 text-sm font-medium">Monitor and manage your IoT hardware kit</p>
          </div>
          <button 
            onClick={() => setIsReplacing(true)}
            disabled={isUpdating}
            className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all shadow-xl shadow-green-100 group"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Replace NodeMCU
          </button>
        </div>

        {/* Device Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={`bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 ${user?.isMonitoringActive ? '' : 'grayscale-[0.5] opacity-90'}`}>
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 transition-colors ${user?.isMonitoringActive ? 'bg-green-500/20' : 'bg-red-500/10'}`}></div>
              
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Cpu size={24} className={user?.isMonitoringActive ? 'text-green-400' : 'text-gray-400'} />
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    user?.isMonitoringActive 
                    ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {user?.isMonitoringActive ? 'Connected' : 'Sleeping'}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active HardwareID</p>
                  <h3 className="text-xl font-bold">{user?.deviceId || "AS-NODE-000"}</h3>
                </div>

                {/* Live Monitoring Toggle */}
                <div 
                  onClick={handleToggleMonitoring}
                  className={`p-4 rounded-[1.5rem] border flex items-center justify-between group cursor-pointer transition-all ${
                    user?.isMonitoringActive 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white/10 border-red-500/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${user?.isMonitoringActive ? 'text-green-400' : 'text-red-400'}`}>
                      {user?.isMonitoringActive ? 'Live Monitoring' : 'Monitoring Disabled'}
                    </span>
                    <span className="text-sm font-bold text-white">{user?.isMonitoringActive ? 'Active' : 'Stopped'}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${user?.isMonitoringActive ? 'bg-green-500 justify-end' : 'bg-gray-700 justify-start'}`}>
                    <motion.div 
                      layout
                      className="w-4 h-4 bg-white rounded-full shadow-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Wifi size={16} className={user?.isMonitoringActive ? 'text-green-400' : 'text-gray-400'} />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Signal</span>
                      <span className="text-xs font-black">{user?.isMonitoringActive ? '-64dBm' : 'OFF'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Battery size={16} className={user?.isMonitoringActive ? 'text-green-400' : 'text-gray-400'} />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Battery</span>
                      <span className="text-xs font-black">{user?.isMonitoringActive ? '84%' : '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg shadow-gray-100/30">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Kit Details</h4>
                  <Settings size={16} className="text-gray-300 pointer-events-none" />
               </div>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-medium">Firmware</span>
                     <span className="text-xs font-bold text-gray-900">v2.1.0-stable</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-medium">Status</span>
                     <span className={`text-xs font-bold ${user?.isMonitoringActive ? 'text-green-600' : 'text-orange-600'}`}>
                        {user?.isMonitoringActive ? 'Polling' : 'Hibernate'}
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400 font-medium">Last Sync</span>
                     <span className="text-xs font-bold text-gray-900">1m ago</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 px-2">
              <Activity size={20} className="text-green-600" />
              Sensor Health
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sensors.map((sensor, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className={`bg-white rounded-[2rem] p-6 border border-gray-100 shadow-md shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col gap-4 group ${user?.isMonitoringActive ? '' : 'opacity-60 saturate-0'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl ${sensor.status === 'Healthy' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                      {sensor.status === 'Healthy' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Score</span>
                      <span className={`text-lg font-black ${sensor.health > 90 ? 'text-green-600' : 'text-orange-600'}`}>{sensor.health}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-md font-bold text-gray-900">{sensor.name}</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter italic">{sensor.type} Input Channel</p>
                  </div>

                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sensor.health}%` }}
                      className={`h-full ${sensor.health > 90 ? 'bg-green-500' : 'bg-orange-500'}`}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Replacement Modal (Simplified) */}
        <AnimatePresence>
          {isReplacing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border border-gray-100"
              >
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-600">
                    <RefreshCcw size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Pair New Hardware</h3>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">Enter the Device ID printed on your new NodeMCU unit to link it to your account.</p>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">New Device ID</label>
                      <input 
                        type="text" 
                        value={newDeviceId}
                        onChange={(e) => setNewDeviceId(e.target.value)}
                        placeholder="e.g. AS-NODE-2024-X"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/40 transition-all uppercase"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setIsReplacing(false)}
                        disabled={isUpdating}
                        className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 disabled:opacity-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleReplace}
                        disabled={isUpdating}
                        className="flex-1 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                      >
                        {isUpdating ? <RefreshCcw size={18} className="animate-spin" /> : 'Pair Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}
