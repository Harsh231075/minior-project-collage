import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";
import { Plus } from "lucide-react";

export default function DevicesPage() {

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-6 text-right">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-100 group shrink-0 w-fit">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Pair New Device
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <Empty
            title="No Devices Found"
            description="Currently there are no IoT nodes connected to your AgroSense AI network. Click 'Pair New Device' to start."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
