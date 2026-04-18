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
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function DevicesPage() {
  const [user, setUser] = useState<any>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");

  useEffect(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const sensors = [
    { name: "Soil Moisture Sensor", status: "Healthy", type: "Analog", health: 98 },
    { name: "DHT22 (Temp & Humidity)", status: "Healthy", type: "Digital", health: 100 },
    { name: "pH Value Probe", status: "Check Needed", type: "Analog", health: 72 },
    { name: "Rain Detection Module", status: "Healthy", type: "Digital", health: 100 },
  ];

  const handleReplace = async () => {
    // This would call an API to update the deviceId
    alert(`Requesting to pair new device: ${newDeviceId}. In MVP, this will update your profile.`);
    setIsReplacing(false);
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
            className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-100 group"
          >
            <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            Replace NodeMCU
          </button>
        </div>

        {/* Device Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Cpu size={24} className="text-green-400" />
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                    Connected
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active HardwareID</p>
                  <h3 className="text-xl font-bold">{user?.deviceId || "AS-NODE-000"}</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Wifi size={16} className="text-green-400" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Signal</span>
                      <span className="text-xs font-black">-64dBm</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <Battery size={16} className="text-green-400" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Battery</span>
                      <span className="text-xs font-black">84%</span>
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
                  <span className="text-xs text-gray-400 font-medium">Uptime</span>
                  <span className="text-xs font-bold text-gray-900">14 Days, 2h</span>
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
                  className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-md shadow-gray-100/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col gap-4 group"
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
        {isReplacing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
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
                      className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReplace}
                      className="flex-1 px-6 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-green-100"
                    >
                      Pair Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
