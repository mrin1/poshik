"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useDashboardData } from "@/hooks/useDashboardData";
import { 
  PawPrint, Calendar, ShoppingBag, Map as MapIcon, 
  Clock, ChevronRight, PackageCheck, Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function OwnerDashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore();
  const { data, isLoading } = useDashboardData(user?.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    );
  }

  const { stats, nextAppointment, recentOrders } = data || { stats: { totalPets: 0, upcomingCount: 0, activeOrders: 0 }, nextAppointment: null, recentOrders: [] };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      
  
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Owner <br /> Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-orange-600" /> Welcome back, {user?.full_name?.split(" ")[0]}!
          </p>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="My Pets" value={stats.totalPets} sub="Active profiles" color="orange" icon={<PawPrint className="h-5 w-5" />} />
        <MetricCard title="Next Visit" value={stats.upcomingCount} sub="Vet consultation" color="blue" highlight icon={<Calendar className="h-5 w-5" />} />
        <MetricCard title="Active Orders" value={stats.activeOrders} sub="Package tracking" color="emerald" icon={<ShoppingBag className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
            <CardHeader className="flex flex-row items-center justify-between p-8 bg-slate-50/50">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Next Appointment</CardTitle>
                <CardDescription className="font-medium text-[10px] uppercase tracking-widest text-slate-400">Status Overview</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {nextAppointment ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-blue-100 group">
                  <div className="flex items-center gap-6">
                    <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200">
                      <Clock size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 uppercase tracking-tight">{nextAppointment.doctor_name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Consultation for <span className="text-blue-600">{nextAppointment.pet?.name}</span>
                      </p>
                      <p className="text-xs font-bold text-slate-900 mt-2">
                        {new Date(nextAppointment.appointment_date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <Badge className="mt-4 sm:mt-0 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-none bg-emerald-100 text-emerald-700">
                    {nextAppointment.status}
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No upcoming visits</p>
                </div>
              )}
              <Button 
                onClick={() => router.push("/owner/appointments")}
                className="w-full h-14 mt-6 rounded-2xl bg-slate-950 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-600 shadow-xl"
              >
                Book New Consultation
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <ShortcutCard href="/owner/map" icon={<MapIcon />} title="Discover" sub="Pets Map" color="orange" />
            <ShortcutCard href="/owner/shop" icon={<ShoppingBag />} title="Pet Shop" sub="Buy Supplies" color="emerald" />
          </div>
        </div>

        <Card className="lg:col-span-5 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
          <CardHeader className="p-8 bg-slate-50/50">
            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <div key={order.id} className="group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status: {order.status}</p>
                    </div>
                    <p className="text-base font-black text-slate-900">₹{order.total_amount}</p>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${order.status === 'SHIPPED' ? 'bg-orange-500 w-2/3' : 'bg-emerald-500 w-full'}`} />
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-400 text-xs font-bold uppercase py-10">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, sub, icon, color, highlight = false }: any) {
    const variants: any = {
        orange: "bg-orange-50 text-orange-600",
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600"
    };
    return (
        <Card className={`border-none shadow-lg rounded-[2.5rem] ${highlight ? 'ring-2 ring-orange-500/20' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</CardTitle>
                <div className={`p-3 rounded-2xl ${variants[color]}`}>{icon}</div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">{value}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{sub}</p>
            </CardContent>
        </Card>
    );
}

function ShortcutCard({ href, icon, title, sub, color }: any) {
    return (
        <Link href={href} className="block group">
            <Card className={`border-none shadow-none rounded-[2rem] transition-all bg-${color}-50/50 group-hover:bg-${color}-100/50`}>
                <CardContent className="p-8 flex flex-col items-center text-center space-y-3">
                    <div className="bg-white p-4 rounded-full shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
                    <div>
                        <div className="font-black text-xs uppercase tracking-tight text-slate-900">{title}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{sub}</div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}