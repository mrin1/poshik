"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Menu,
  ShoppingCart,
  PawPrint,
  Search,
  PlusCircle,
  MapPin,
  ChevronDown,
  LogOut,
  User,
  History,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Hooks & State Management
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useCart } from "@/hooks/useCart";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Dynamic Data Extraction
  const { user, logout } = useAuthStore(); // Source: Register Table / Auth Session
  const { cartCount, isLoaded } = useCart(); // Source: Live Cart State

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Logout
  const handleSignOut = async () => {
    await logout();
    router.push("/login");
  };

  // Prevent Hydration Mismatch
  if (!mounted)
    return <div className="h-20 bg-white border-b border-slate-50 w-full" />;

  // Generate Initials for Fallback
  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "GU";

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 md:px-10 shrink-0 z-50 sticky top-0">
      
      {/* LEFT: BRANDING & MOBILE TRIGGER */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-12 w-12 rounded-2xl hover:bg-orange-50 transition-all"
        >
          <Menu className="h-6 w-6 text-slate-900" />
        </Button>

        <div 
          onClick={() => router.push("/")}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="bg-orange-500 p-2.5 rounded-2xl shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300">
            <PawPrint className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block leading-none mb-1 text-center">
              Poshik
            </span>
            <span className="text-xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
              Platform
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: DYNAMIC SEARCH & LOCATION */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-12 items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder="Search Vets, Supplies, or Friends..."
            className="h-12 pl-12 rounded-2xl border-none bg-slate-50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-orange-100 transition-all w-full"
          />
        </div>
        <div className="flex items-center gap-2 px-4 h-12 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all cursor-pointer">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
            Kolkata
          </span>
          <ChevronDown className="h-3 w-3 text-slate-300" />
        </div>
      </div>

      {/* RIGHT: ACTIONS & USER PROFILE */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-2xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 hidden lg:flex"
        >
          <PlusCircle size={22} strokeWidth={2.5} />
        </Button>

        {/* Dynamic Cart Badge */}
        <div className="relative group">
          <Button
            onClick={() => router.push("/cart")}
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <ShoppingCart size={22} />
            {isLoaded && cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-blue-600 text-white font-black text-[9px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-md animate-in zoom-in">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Notifications */}
        <div className="relative group">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-2xl text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-all"
          >
            <Bell size={22} />
            <Badge className="absolute -top-1 -right-1 bg-orange-600 text-white font-black text-[9px] h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-md">
              0
            </Badge>
          </Button>
        </div>

        <div className="h-8 w-[1px] bg-slate-100 mx-2 hidden sm:block" />

        {/* DYNAMIC PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="h-12 w-12 rounded-2xl border-2 border-white shadow-md group-hover:border-orange-200 transition-all overflow-hidden bg-slate-100 ring-1 ring-slate-100">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage
                    src={(user as any)?.avatar_url || "/avatars/default.jpg"}
                    alt={user?.full_name || "User"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-orange-500 text-white font-[900] text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 mt-4 p-3 rounded-[1.8rem] border-none shadow-2xl shadow-slate-200 bg-white"
            align="end"
          >
            <DropdownMenuLabel className="p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-[900] uppercase tracking-tight text-slate-900 line-clamp-1">
                  {user?.full_name || "Guest User"}
                </p>
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="border-none bg-orange-50 text-orange-600 font-black text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                    {user?.role?.replace("_", " ") || "Member"}
                  </Badge>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={8} className="text-orange-500" /> Kolkata
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            <div className="p-2 space-y-1">
              <DropdownMenuItem onClick={() => router.push("/profile")} className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                <User size={14} className="mr-2" /> Personal Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")} className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                <History size={14} className="mr-2" /> Purchase History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")} className="rounded-xl font-bold text-xs uppercase tracking-widest py-3 focus:bg-orange-50 focus:text-orange-600 cursor-pointer">
                <Settings size={14} className="mr-2" /> Platform Settings
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator className="bg-slate-50 mx-2" />
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] py-4 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer"
            >
              <LogOut size={14} className="mr-2" /> Secure Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}