"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  Database,
  Search,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { readingService } from "@/services/reading.service";
import { motion } from "framer-motion";

export default function SensorsPage() {
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.deviceId) {
      fetchHistory(user.deviceId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHistory = async (deviceId: string) => {
    try {
      const res = await readingService.getHistory(deviceId);
      setReadings(res.data);
    } catch (err) {
      console.error("Failed to fetch sensor history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReadings = readings.filter(r =>
    r.timestamp.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.temperature.toString().includes(searchTerm) ||
    r.soilMoisture.toString().includes(searchTerm)
  );

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReadings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReadings.length / itemsPerPage);

  const getStatusBadge = (reading: any) => {
    if (reading.soilMoisture < 30) return { label: "Needs Water", class: "bg-red-50 text-red-600 border-red-100" };
    if (reading.soilMoisture > 80) return { label: "Too Wet", class: "bg-blue-50 text-blue-600 border-blue-100" };
    return { label: "Perfect", class: "bg-green-50 text-green-600 border-green-100" };
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Sensor Records</h1>
            <p className="text-gray-500 text-sm font-medium">Historical data from your IoT nodes</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                placeholder="Search history..."
                className="pl-11 pr-6 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500/30 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-colors shadow-sm">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Time & Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Moisture</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Temperature</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Humidity</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-8 py-4"><div className="h-10 bg-gray-50 rounded-xl w-full"></div></td>
                    </tr>
                  ))
                ) : currentItems.length > 0 ? (
                  currentItems.map((r, i) => {
                    const status = getStatusBadge(r);
                    return (
                      <motion.tr
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        key={r._id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(r.timestamp).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-black text-blue-600">{r.soilMoisture.toFixed(1)}%</td>
                        <td className="px-6 py-5 text-sm font-black text-orange-600">{r.temperature.toFixed(1)}°C</td>
                        <td className="px-6 py-5 text-sm font-black text-teal-600">{r.humidity.toFixed(1)}%</td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status.class}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 transition-all text-gray-300 hover:text-green-600">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                          <Database size={30} />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No records found for this device.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
             <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReadings.length)} of {filteredReadings.length}
                </span>
                
                <div className="flex items-center gap-2">
                   <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-green-600 disabled:opacity-50 transition-all shadow-sm"
                   >
                      Prev
                   </button>
                   
                   <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => (
                         <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                               currentPage === i + 1 
                               ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                               : 'bg-white text-gray-400 hover:text-gray-600 border border-gray-100'
                            }`}
                         >
                            {i + 1}
                         </button>
                      ))}
                   </div>

                   <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-green-600 disabled:opacity-50 transition-all shadow-sm"
                   >
                      Next
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
