"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  ShieldAlert, 
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Zap
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Fix Hydration: Ensure route highlighting only happens on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "KYC Approvals", href: "/admin/kyc-approvals", icon: ShieldAlert }, 
    { name: "User Directory", href: "/admin/users", icon: Users }, 
    { name: "Community Events", href: "/admin/events", icon: Calendar }, 
  ];

  if (!mounted) return <aside className="w-80 bg-white border-r border-slate-50 hidden lg:flex" />;

  return (
    <aside className="w-80 bg-white border-r border-slate-100 hidden lg:flex flex-col h-[calc(100vh-5rem)] sticky top-20 overflow-hidden">
      
      {/* NAVIGATION SECTION */}
      <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto no-scrollbar">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 px-4">Main Menu</p>
        
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (pathname?.startsWith(`${link.href}/`) && link.href !== "/admin");
          
          return (
            <Link key={link.name} href={link.href} className="group block">
              <div className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                ? "bg-slate-950 text-white shadow-xl shadow-slate-200 translate-x-1" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}>
                <div className="flex items-center">
                  <Icon className={`mr-4 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-orange-500" : "text-slate-400"}`} strokeWidth={2.5} />
                  <span className="text-xs font-black uppercase tracking-widest">{link.name}</span>
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-orange-500" />}
              </div>
            </Link>
          );
        })}

        {/* ADMIN UTILITY CARD */}
        <div className="mt-12 p-6 rounded-[2rem] bg-orange-50/50 border border-orange-100 relative overflow-hidden group">
            <Zap className="absolute -right-2 -bottom-2 h-16 w-16 text-orange-200/50 group-hover:scale-110 transition-transform" />
            <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-1">System Health</p>
            <p className="text-[11px] font-bold text-slate-900 leading-tight">All nodes operational <br /> in Kolkata region.</p>
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-slate-50 space-y-2 bg-slate-50/30">
        <button className="flex items-center w-full px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-white rounded-2xl transition-all group">
          <Settings className="mr-4 h-5 w-5 group-hover:rotate-45 transition-transform" strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-widest">Global Settings</span>
        </button>
         <LogoutButton/>
      </div>
    </aside>
  );
}