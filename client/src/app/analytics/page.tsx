"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  TrendingUp,
  Droplets,
  Zap,
  Leaf,
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { readingService } from "@/services/reading.service";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.deviceId) {
      fetchAnalytics(user.deviceId);
    }
  }, []);

  const fetchAnalytics = async (deviceId: string) => {
    try {
      const res = await readingService.getHistory(deviceId);
      // Process data for charts (reverse for chronological order)
      const chartData = res.data.reverse().map((r: any) => ({
        time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        moisture: parseFloat(r.soilMoisture.toFixed(1)),
        temp: parseFloat(r.temperature.toFixed(1)),
      }));
      setData(chartData);
    } catch (err) {
      console.error("Analytics fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const insights = [
    { title: "Water Savings", value: "1,240 Litres", detail: "Compared to manual pump usage", icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Plant Health", value: "94%", detail: "Optimal growing conditions", icon: Leaf, color: "text-green-600", bg: "bg-green-50" },
    { title: "Energy Saved", value: "₹450.00", detail: "Estimated electricity savings", icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Farm Analytics</h1>
            <p className="text-gray-500 text-sm font-medium italic">Deep insights into your field's historical performance</p>
          </div>

          <div className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded-2xl w-fit shrink-0 shadow-sm">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
              <Calendar size={18} />
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Analysis Range</span>
              <span className="text-xs font-black text-gray-900 tracking-tight">Last 24 Hours</span>
            </div>
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg shadow-gray-100/20 flex flex-col gap-4 group hover:scale-[1.02] transition-all"
            >
              <div className={`p-3 rounded-2xl ${insight.bg} ${insight.color} w-fit`}>
                <insight.icon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{insight.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{insight.title}</p>
                <div className="flex items-center gap-1 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[10px] text-gray-500 font-bold">{insight.detail}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Big Trends Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/30">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Soil Moisture Trends</h3>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Variation over recorded time</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[10px] font-black text-gray-500">Moisture %</span>
                  </div>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="moisture"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMoisture)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-100/30 flex-1">
              <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">AI Summary</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Performance Score</p>

              <div className="flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-32 h-32 rounded-full border-[10px] border-green-500 border-t-transparent flex items-center justify-center relative">
                  <div className="absolute inset-0 border-[10px] border-green-50 rounded-full"></div>
                  <div className="flex flex-col items-center relative z-10">
                    <span className="text-3xl font-black text-gray-900">9.2</span>
                    <span className="text-[10px] font-black text-green-600 uppercase">Excellent</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-[11px] font-bold text-gray-900">Yield Prediction</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">Your current pattern suggests an 8% increase in yield compared to average.</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Info size={14} className="text-blue-600" />
                      <span className="text-[11px] font-bold text-gray-900">Expert Tip</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium">Night-time moisture retention is slightly high. Observe for root rot signs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
