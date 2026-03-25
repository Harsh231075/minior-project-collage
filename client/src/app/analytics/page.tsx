import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";
import { Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 text-right">
          <div className="flex items-center gap-3 bg-white p-2 border border-gray-100 rounded-2xl w-fit shrink-0 shadow-sm">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Calendar size={20} />
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Reports For</span>
              <span className="text-sm font-bold text-gray-900 tracking-tight">March 2026 - Current</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Empty
            title="No Analytics Data"
            description="Predictive models and correlation graphs will appear here once the system collects enough sensor data (min. 7 days)."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
