"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Tag,
  ChevronRight,
  Store,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { useUIStore } from "@/zustand/store/useUIStore";
import { sidebarLinks } from "@/utils/shop";
export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { isSidebarOpen, closeSidebar } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <aside className="w-80 bg-white border-r border-slate-50 hidden lg:flex" />
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
        className={`w-80 bg-white border-r border-slate-100 flex flex-col h-screen lg:h-[calc(100vh-5rem)] fixed lg:sticky top-0 lg:top-20 z-50 lg:z-0 overflow-hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="lg:hidden flex justify-end p-4 border-b border-slate-50">
          <button
            onClick={closeSidebar}
            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-6 px-4">
            Merchant Center
          </p>

          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (pathname?.startsWith(`${link.href}/`) && link.href !== "/shop");

            return (
              <Link
                key={link.name}
                href={link.href}
                className="group block"
                onClick={closeSidebar}
              >
                <div
                  className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-slate-950 text-white shadow-xl shadow-slate-200 translate-x-1"
                      : "text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-600"
                  }`}
                >
                  <div className="flex items-center">
                    <Icon
                      className={`mr-4 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-emerald-400" : "text-slate-400"}`}
                      strokeWidth={2.5}
                    />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {link.name}
                    </span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-emerald-400" />
                  )}
                </div>
              </Link>
            );
          })}

          <div className="mt-12 p-6 rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group shadow-lg">
            <Store className="absolute -right-2 -bottom-2 h-20 w-20 text-white/5 group-hover:scale-110 transition-transform" />
            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-1">
              Store Status
            </p>
            <p className="text-[11px] font-[900] leading-tight uppercase tracking-tight">
              Kolkata Warehouse <br /> is currently live
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Accepting Orders
              </span>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-2 bg-slate-50/30">
          {/* <button className="flex items-center w-full px-5 py-4 text-slate-500 hover:text-slate-900 hover:bg-white rounded-2xl transition-all group font-bold">
            <Settings className="mr-4 h-5 w-5 group-hover:rotate-45 transition-transform" strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-widest">Shop Settings</span>
          </button> */}
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
