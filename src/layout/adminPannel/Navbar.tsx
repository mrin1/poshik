"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, ShieldCheck, UserCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 1. Import your Zustand authentication store
import { useAuthStore } from "@/zustand/store/useAuthStore"; 

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  
  // 2. Extract the active user session securely
  const { user } = useAuthStore(); 

  // Fix Hydration: Ensure client-only UI (like notification dots) renders after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-20 bg-white border-b border-slate-50" />;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-50 sticky top-0">
      
      {/* LEFT: BRANDING & MOBILE TRIGGER */}
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-900 transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-2 rounded-2xl shadow-lg shadow-slate-200">
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 block leading-none mb-1">Poshik</span>
            <span className="text-lg font-[900] uppercase tracking-tighter text-slate-900 leading-none">Control Center</span>
          </div>
        </div>
      </div>

      {/* CENTER: SYSTEM SEARCH (Contextual for Admin) */}
      <div className="hidden md:flex flex-1 max-w-md mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-slate-900 transition-colors" />
          <Input 
            placeholder="Search SKUs, Users, or Vets..." 
            className="h-11 pl-12 rounded-2xl border-none bg-slate-50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-slate-200"
          />
        </div>
      </div>

      {/* RIGHT: NOTIFICATIONS & USER PROFILE */}
      <div className="flex items-center gap-6">
        {/* Notification Hub */}
        <button className="group relative h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all">
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-orange-600 rounded-full border-2 border-white animate-in zoom-in"></span>
        </button>

        <Separator />

        {/* Profile Section */}
        <div className="flex items-center gap-4 pl-2">
          <div className="hidden sm:block text-right">
            
            {/* 3. DYNAMIC USER NAME */}
            <p className="text-sm font-[900] uppercase tracking-tight text-slate-900 leading-none">
              {user?.full_name || "System Admin"}
            </p>
            
            {/* 4. DYNAMIC ROLE BADGE */}
            <Badge variant="outline" className="mt-1.5 border-none bg-orange-50 text-orange-600 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">
              {user?.role === "SUPER-ADMIN" ? "Super Admin" : "Admin"}
            </Badge>
            
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden group cursor-pointer hover:border-slate-200 transition-all">
            <UserCircle className="h-8 w-8 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}

// Internal Separator
function Separator() {
  return <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />;
}