import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
          <div className="flex items-center gap-2 bg-white/50 p-1 border border-gray-100 rounded-2xl w-fit shrink-0 backdrop-blur-sm shadow-sm">
            <button className="px-5 py-2.5 bg-green-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95">Active</button>
            <button className="px-5 py-2.5 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors">Archived</button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Empty
            title="No Alerts Today"
            description="Great news! All systems are performing within safe operating ranges. There are no active errors or warnings to display."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
