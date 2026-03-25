import DashboardLayout from "@/components/DashboardLayout";
import { Settings, User, Bell, Shield, Sliders, Save, Trash2, Camera, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 shrink-0">
             <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Settings</h2>
             <p className="text-gray-500 font-medium text-sm md:text-md max-w-lg">Manage your profile, preferences, and system configurations.</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-green-100 group shrink-0 w-fit">
             <Save size={18} />
             Save All Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           
           <div className="lg:col-span-1 border-r border-gray-100 pr-8 hidden lg:block">
              <nav className="space-y-2">
                 {[
                   { icon: User, name: "Public Profile", active: true },
                   { icon: Bell, name: "Notifications", active: false },
                   { icon: Shield, name: "Security", active: false },
                   { icon: Sliders, name: "System Preferences", active: false },
                 ].map((nav, i) => (
                   <button key={i} className={`flex items-center gap-3.5 p-3.5 rounded-xl transition-all duration-200 group w-full text-left ${nav.active ? "bg-green-50 text-green-700 font-bold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
                      <nav.icon size={20} className={nav.active ? "text-green-600" : "text-gray-400 group-hover:text-gray-700"} />
                      <span className="text-sm">{nav.name}</span>
                   </button>
                 ))}
              </nav>
           </div>

           <div className="lg:col-span-3 space-y-10">
              
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/30 p-10 md:p-12">
                 <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                    <div className="relative group">
                       <img
                         src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200"
                         className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-green-50 shadow-2xl transition-all group-hover:ring-green-100"
                         alt="Profile"
                       />
                       <button className="absolute bottom-1 right-1 p-2.5 bg-green-600 text-white rounded-[1rem] shadow-xl hover:scale-110 active:scale-95 transition-all">
                          <Camera size={18} />
                       </button>
                    </div>
                    <div className="flex flex-col text-center md:text-left">
                       <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Ramesh Kumar</h3>
                       <p className="text-gray-400 font-medium text-sm mt-0.5">Farmer & System Admin</p>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                          <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-100 shadow-sm">Verified Farm Owner</span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 shadow-sm">Pro User</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { icon: Mail, label: "Email Address", value: "ramesh.kumar@agrosense.ai", type: "email" },
                      { icon: Phone, label: "Phone Number", value: "+91 9876543210", type: "text" },
                      { icon: MapPin, label: "Farm Location", value: "Bokaro Steel City, Jharkhand", type: "text" },
                      { icon: Globe, label: "Website", value: "www.my-farm-portal.com", type: "text" },
                    ].map((field, i) => (
                      <div key={i} className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1 group-hover:text-green-600 transition-colors">{field.label}</label>
                        <div className="relative">
                           <field.icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" />
                           <input 
                             type={field.type} 
                             defaultValue={field.value} 
                             className="pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] text-sm font-bold text-gray-800 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/20 focus:bg-white transition-all w-full"
                           />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-red-50/50 rounded-[2rem] border border-red-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-red-50 border-dashed">
                 <div className="flex flex-col gap-1 text-center md:text-left">
                    <h4 className="text-sm font-bold text-red-900 tracking-tight uppercase">Delete Master Account</h4>
                    <p className="text-xs text-red-600/70 font-medium max-w-sm">This action is irreversible and will permanently delete all sensor data, farm mappings, and device history.</p>
                 </div>
                 <button className="px-6 py-3 bg-white border border-red-200 text-red-600 rounded-2xl font-bold text-xs hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-95 transition-all shadow-sm flex items-center gap-2 group">
                    <Trash2 size={16} className="group-hover:animate-bounce" />
                    Delete My Data
                 </button>
              </div>

           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
