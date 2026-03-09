"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ShieldAlert, 
  Calendar, 
  Activity, 
  IndianRupee,
  ArrowRight,
  Store,
  TrendingUp,
  Loader2
} from "lucide-react";

import { supabase } from "@/utils/supabase";
import { PlatformStats, RecentUser } from "@/typescript/interface/admin";

// Interfaces for dynamic data

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    pendingKyc: 0,
    activeEvents: 0,
    monthlyRevenue: 0, 
  });
  const [recentRegistrations, setRecentRegistrations] = useState<RecentUser[]>([]);


  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
  
      const { count: totalUsers } = await supabase
        .from("register")
        .select("*", { count: "exact", head: true });

      const { count: pendingKyc } = await supabase
        .from("register")
        .select("*", { count: "exact", head: true })
        .eq("kyc_status", "PENDING");

      
      const { count: activeEvents } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("status", "APPROVED");

     
      const { data: recentUsers, error: recentError } = await supabase
        .from("register")
        .select("id, full_name, role, created_at, kyc_status")
        .order("created_at", { ascending: false })
        .limit(4);

      if (recentError) throw recentError;

     
      setStats({
        totalUsers: totalUsers || 0,
        pendingKyc: pendingKyc || 0,
        activeEvents: activeEvents || 0,
        monthlyRevenue: 45000, 
      });

      if (recentUsers) {
        const formatted = recentUsers.map((u: any) => ({
          id: u.id,
          name: u.full_name || "Unknown User",
          role: u.role || "USER",
          date: new Date(u.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
          status: u.kyc_status || "NOT_SUBMITTED",
        }));
        setRecentRegistrations(formatted);
      }
    } catch (error: any) {
      console.error("Dashboard Fetch Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Platform <br /> Overview
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm flex items-center gap-2">
            Operational intelligence for the Poshik ecosystem.
            {isLoading && <Loader2 className="h-3 w-3 animate-spin text-orange-600" />}
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse inline-block"></span>
                Node Active
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
            title="Total Users" 
            value={isLoading ? "-" : stats.totalUsers.toLocaleString()} 
            sub="Registered accounts" 
            icon={<Users className="h-5 w-5 text-blue-600" />}
            color="blue"
        />
        <MetricCard 
            title="Pending KYC" 
            value={isLoading ? "-" : stats.pendingKyc} 
            sub={stats.pendingKyc > 0 ? "Action required" : "All caught up"} 
            icon={<ShieldAlert className="h-5 w-5 text-amber-600" />}
            color="amber"
            highlight={stats.pendingKyc > 0}
        />
        <MetricCard 
            title="Active Events" 
            value={isLoading ? "-" : stats.activeEvents} 
            sub="Community meetups" 
            icon={<Calendar className="h-5 w-5 text-purple-600" />}
            color="purple"
        />
        <MetricCard 
            title="Revenue" 
            value={`₹${stats.monthlyRevenue.toLocaleString()}`} 
            sub="Projected target" 
            icon={<IndianRupee className="h-5 w-5 text-emerald-600" />}
            color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-slate-50/50">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Recent Registrations</CardTitle>
              <CardDescription className="font-medium">Monitor new participants entering the circle.</CardDescription>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-orange-600">
                View All <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
               <div className="flex justify-center items-center py-10">
                 <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
               </div>
            ) : recentRegistrations.length === 0 ? (
               <div className="text-center py-10 text-slate-400 font-bold uppercase tracking-widest text-xs">
                 No recent registrations
               </div>
            ) : (
              <div className="space-y-4">
                {recentRegistrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100 group">
                    <div className="flex items-center gap-5">
                      <div className={`p-4 rounded-2xl shadow-sm ${
                          user.role === 'DOCTOR' ? 'bg-blue-600 text-white' : 
                          user.role === 'SHOP' ? 'bg-emerald-600 text-white' : 
                          'bg-slate-900 text-white'
                      }`}>
                        {user.role === 'DOCTOR' ? <Activity size={20} /> : user.role === 'SHOP' ? <Store size={20} /> : <Users size={20} />}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">{user.name}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user.role} • {user.date}</p>
                      </div>
                    </div>
                    <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-none ${
                      user.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                      user.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 
                      user.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          
          <Card className="bg-slate-950 text-white rounded-[2rem] border-none shadow-2xl p-2 relative overflow-hidden">
      
            {stats.pendingKyc > 0 && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
            )}
            
            <CardHeader className="p-8 pb-4 relative z-10">
              <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-orange-500" />
                KYC Alert
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 relative z-10">
              <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8">
                There are <span className="text-white font-bold">{stats.pendingKyc} pending verification</span> requests from Vets and Shops requiring manual document review.
              </p>
              <Link href="/admin/kyc-approvals">
                <Button className="w-full h-14 bg-orange-600 hover:bg-white hover:text-orange-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-orange-900/20">
                  Review Pending
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 mb-4">Quick Management</h3>
            <QuickLink href="/admin/events" icon={<Calendar className="text-purple-500" />} label="Manage Community Events" />
            <QuickLink href="/admin/users" icon={<Users className="text-blue-500" />} label="Full User Directory" />
            <QuickLink href="/admin/reports" icon={<TrendingUp className="text-emerald-500" />} label="Analytics & Reports" />
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon, color, highlight = false }: any) {
    return (
        <Card className={`border-none shadow-lg shadow-slate-200/60 rounded-[2rem] transition-all hover:scale-[1.02] ${highlight ? 'ring-2 ring-amber-500/20 bg-amber-50/10' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-7 pt-7">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</CardTitle>
                <div className={`p-2.5 rounded-2xl bg-${color}-50`}>{icon}</div>
            </CardHeader>
            <CardContent className="px-7 pb-7">
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${highlight ? 'text-amber-600' : 'text-slate-400'}`}>{sub}</p>
            </CardContent>
        </Card>
    );
}

function QuickLink({ href, icon, label }: any) {
    return (
        <Link href={href} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all group">
            <div className="flex items-center gap-4 text-slate-900 font-bold text-xs uppercase tracking-tight">
                <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-orange-50 transition-colors">{icon}</div>
                {label}
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </Link>
    );
}