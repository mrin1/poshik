"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, ShoppingCart, PawPrint, Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useCart } from "@/hooks/useCart";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUIStore } from "@/zustand/store/useUIStore";

export default function OwnerNavbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const { user } = useAuthStore();
  const { cartCount, isLoaded } = useCart();
  const { openSidebar } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return <div className="h-20 bg-white border-b border-slate-50 w-full" />;

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 shrink-0 z-50 sticky top-0 font-sans">
      <div className="flex items-center gap-5">
        <button
          onClick={openSidebar}
          className="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-900 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div
          onClick={() => router.push("/owner/dashboard")}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300">
            <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block leading-none mb-1">
              Poshik
            </span>
            <span className="text-xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
              Home
            </span>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-12">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder="Search Pets, Vets, or Supplies..."
            className="h-11 pl-12 rounded-2xl border-none bg-slate-50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-orange-100 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {/* <Button 
          onClick={() => router.push("/owner/cart")}
          variant="ghost" 
          size="icon" 
          className="relative h-12 w-12 rounded-2xl hover:bg-orange-50 group"
        >
          <ShoppingCart className="h-5 w-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
          {isLoaded && cartCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </Button> */}

        <Button
          variant="ghost"
          size="icon"
          className="relative h-12 w-12 rounded-2xl hover:bg-orange-50 group"
        >
          <Bell className="h-5 w-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-in zoom-in"></span>
        </Button>

        <div className="h-8 w-[1px] bg-slate-100 hidden sm:block mx-2" />

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-[900] uppercase tracking-tight text-slate-900 leading-none">
              {user?.full_name || "Pet Owner"}
            </p>
            <Badge
              variant="outline"
              className="mt-1.5 border-none bg-orange-50 text-orange-600 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full"
            >
              {user?.role?.replace("_", " ") || "Guest"}
            </Badge>
          </div>

          <div className="h-12 w-12 rounded-2xl border-2 border-white shadow-md overflow-hidden group cursor-pointer hover:border-orange-200 transition-all ring-1 ring-slate-100">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage
                src={user?.avatar_url || "/avatars/user-main.jpg"}
                alt={user?.full_name || "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-orange-500 text-white font-black text-xs uppercase">
                {user?.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "GU"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
