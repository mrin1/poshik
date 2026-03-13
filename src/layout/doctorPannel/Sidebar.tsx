"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Settings,
  Users,
  ChevronRight,
  Activity,
  Heart,
  X,
} from "lucide-react";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { LogoutButton } from "@/components/logout-button";
import { useUIStore } from "@/zustand/store/useUIStore";
import { sidebarLinks } from "@/utils/doctor";

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <aside className="w-80 bg-slate-50 border-r border-slate-200 hidden lg:flex h-screen" />
    );

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`w-80 bg-white border-r border-slate-200 flex flex-col h-screen lg:h-[calc(100vh-5rem)] fixed lg:sticky top-0 lg:top-20 z-50 lg:z-0 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="lg:hidden flex justify-end p-4 border-b border-slate-50">
          <button
            onClick={closeSidebar}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto no-scrollbar">
          <div className="flex items-center px-4 mb-8">
            <div className="h-1 w-8 bg-blue-600 rounded-full mr-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Clinical Management
            </p>
          </div>

          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (pathname?.startsWith(`${link.href}/`) &&
                link.href !== "/doctor");

            return (
              <Link
                key={link.name}
                href={link.href}
                className="group block"
                onClick={closeSidebar}
              >
                <div
                  className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl transition-all duration-500 relative ${
                    isActive
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-300 translate-x-1"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-xl mr-3 transition-colors ${isActive ? "bg-blue-600/20 text-blue-400" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {link.name}
                    </span>
                  </div>
                  {isActive ? (
                    <ChevronRight className="h-3 w-3 text-blue-400 animate-pulse" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
              </Link>
            );
          })}

          <div className="mx-2 mt-12 p-5 rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-700 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <Heart className="absolute -right-2 -bottom-2 h-16 w-16 text-white/10 rotate-12" />
            <div className="relative z-10">
              <div className="flex items-center mb-3">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-ping mr-2" />
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-100">
                  Live Status
                </p>
              </div>
              <p className="text-xs font-bold leading-relaxed">
                Clinic active in{" "}
                <span className="underline decoration-blue-300">
                  Kolkata Node
                </span>
                . Accepting urgent vet cases.
              </p>
            </div>
          </div>
        </nav>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-2">
          <div className="flex items-center p-3 mb-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px] uppercase">
              {user?.full_name?.charAt(0) || "D"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">
                {user?.full_name || "Doctor"}
              </p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Verified Vet
              </p>
            </div>
          </div>

          {/* <button className="flex items-center w-full px-5 py-3 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl transition-all group font-bold">
            <Settings className="mr-3 h-4 w-4 group-hover:rotate-90 transition-transform duration-500" strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">System Settings</span>
          </button>
           */}
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
