"use client";

import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ArrowRight,
  Sparkles,
  Activity
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const shopStats = [
  { title: "Revenue", value: "₹54,230", desc: "+14% monthly", icon: TrendingUp, trend: "up", color: "emerald" },
  { title: "Orders", value: "182", desc: "+5% weekly", icon: ShoppingBag, trend: "up", color: "blue" },
  { title: "New Customers", value: "43", desc: "-2% monthly", icon: Users, trend: "down", color: "purple" },
  { title: "Low Stock", value: "04", desc: "Attention required", icon: AlertTriangle, trend: "neutral", color: "orange" },
];

const recentOrders = [
  { id: "ORD-9921", customer: "Aditi Rao", item: "Royal Canin Puppy Food", price: "₹2,400", status: "PENDING" },
  { id: "ORD-9920", customer: "Rahul Das", item: "Dog Leash & Collar", price: "₹850", status: "SHIPPED" },
  { id: "ORD-9919", customer: "Suman Singh", item: "Cat Scratching Post", price: "₹1,200", status: "DELIVERED" },
];

export default function ShopDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      
      {/* WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Store <br /> Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" /> Welcome back, Paws & Claws Supplies.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                Store Status: Active
            </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shopStats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* MAIN CONTENT: 12-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT ORDERS (8 Columns) */}
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-slate-50/50">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Recent Transactions</CardTitle>
              <CardDescription className="font-medium text-slate-400 uppercase text-[10px] tracking-widest mt-1">Live order feed</CardDescription>
            </div>
            <Button variant="ghost" className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-emerald-600">
              Manage Orders <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2rem] bg-slate-50 border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="bg-white p-4 rounded-2xl shadow-sm text-slate-400 group-hover:text-emerald-600 transition-colors">
                      <Package size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 uppercase tracking-tight">{order.customer}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {order.item} • <span className="font-mono">{order.id}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="text-right">
                        <p className="text-lg font-[900] text-slate-900 tracking-tighter">{order.price}</p>
                        <Badge className={`px-3 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest border-none mt-1 ${
                            order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 
                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' : 
                            'bg-emerald-100 text-emerald-700'
                        }`}>
                            {order.status}
                        </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-white text-slate-300 hover:text-emerald-600 shadow-sm">
                        <ArrowRight size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>


        <div className="lg:col-span-4 space-y-8">
          
          {/* ALERT CTA */}
          <Card className="bg-emerald-950 text-white rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-2">
            <CardHeader className="p-8 pb-4">
              <div className="p-3 bg-emerald-500 w-fit rounded-2xl mb-4">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-[900] uppercase tracking-tighter leading-tight">Inventory <br /> Warning</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <p className="text-emerald-100/60 font-medium text-sm leading-relaxed mb-8 italic">
                4 premium products are tracking below safety levels. Restock now to maintain Kolkata sales velocity.
              </p>
              <Button className="w-full h-14 bg-emerald-500 hover:bg-white hover:text-emerald-950 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95">
                Restock Inventory
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">Next Payout</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Date</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2"><Clock size={14} /> March 01</span>
                </div>
                <div className="text-center py-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Earnings</p>
                    <h3 className="text-4xl font-[900] text-slate-900 tracking-tighter">₹14,200</h3>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all">
                    Payout History
                </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, desc, icon: Icon, trend, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <Card className="border-none shadow-lg shadow-slate-200/60 rounded-[2.2rem] transition-all hover:scale-[1.02] bg-white">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend !== "neutral" && (
            <div className={`flex items-center text-[10px] font-black ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            </div>
          )}
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <h3 className="text-3xl font-[900] text-slate-900 tracking-tighter mt-1">{value}</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}