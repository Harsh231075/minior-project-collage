import DashboardLayout from "@/components/DashboardLayout";
import { Database, Search, Filter } from "lucide-react";

export default function SensorsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Search sensors..."
                className="pl-11 pr-6 py-3 bg-white border border-gray-100/50 rounded-2xl text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/30 transition-all w-full md:w-64"
              />
            </div>
            <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-green-600 transition-colors shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 p-10 flex flex-col items-center justify-center min-h-100">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100/50">
            <Database size={40} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Sensor Data</h3>
          <p className="text-gray-400 text-sm max-w-sm text-center leading-relaxed font-medium">This section will contain historical sensor tables, node mapping, and real-time logs.</p>
          <button className="mt-8 px-8 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-100">
            Load History
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
