"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Stethoscope, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/zustand/store/useAuthStore"; 

export default function DoctorNavbar() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore(); 

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-20 bg-white border-b border-slate-50 w-full" />;


  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "DR";

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 shrink-0 z-50 sticky top-0">
      
  
      <div className="flex items-center gap-5">
        <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-xl hover:bg-slate-50 transition-colors">
          <Menu className="h-6 w-6 text-slate-900" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
            <Stethoscope className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block leading-none mb-1">Poshik</span>
            <span className="text-lg font-[900] uppercase tracking-tighter text-slate-900 leading-none">Vet Portal</span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <Input 
            placeholder="Search Pet Records..." 
            className="h-11 pl-12 rounded-2xl border-none bg-slate-50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="group relative h-12 w-12 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all">
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-orange-600 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
          
            <p className="text-sm font-[900] uppercase tracking-tight text-slate-900 leading-none">
               {user?.full_name || "Doctor"}
            </p>
            <Badge variant="outline" className="mt-1.5 border-none bg-blue-50 text-blue-700 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">
              {user?.role === "DOCTOR" ? "Verified Vet" : "Staff"}
            </Badge>
          </div>
          
          <div className="h-12 w-12 rounded-2xl border-2 border-white shadow-md overflow-hidden group cursor-pointer hover:border-blue-100 transition-all ring-1 ring-slate-100">
             <Avatar className="h-full w-full rounded-none">
          
                <AvatarImage src={user?.kyc_document_url || ""} alt={user?.full_name} className="object-cover" />
                <AvatarFallback className="bg-blue-600 text-white font-black text-xs uppercase">
                  {initials}
                </AvatarFallback>
             </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}