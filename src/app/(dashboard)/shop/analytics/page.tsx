"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Calendar,
  Filter,
  Activity,
  Sparkles
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

// Mock data
const topProducts = [
  { name: "Royal Canin Puppy Food", sales: 142, revenue: "₹3,40,800", growth: "+12%" },
  { name: "Heavy Duty Leash (Blue)", sales: 89, revenue: "₹80,011", growth: "+18%" },
  { name: "Cat Scratching Post", sales: 64, revenue: "₹76,800", growth: "-5%" },
];

export default function ShopAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  // Fix Hydration: Ensure client-only logic runs after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Store <br /> Insights
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" /> Performance data for the last 30 days.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="h-14 px-8 bg-slate-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95">
            <Calendar className="h-4 w-4 mr-2" /> Date Range
          </Button>
        </div>
      </div>

      {/* PRIMARY METRICS: 4-COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Revenue" value="₹4,82,450" change="+12.5%" isPos icon={TrendingUp} color="emerald" />
        <MetricCard title="Avg Order" value="₹1,850" change="+3.2%" isPos icon={ShoppingBag} color="blue" />
        <MetricCard title="Conversion" value="4.8%" change="-0.4%" isPos={false} icon={BarChart3} color="orange" />
        <MetricCard title="Loyalty" value="28%" change="+5.1%" isPos icon={Users} color="purple" />
      </div>

      {/* VISUAL ANALYTICS: 12-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* REVENUE CHART MOCK (8 Columns) */}
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Revenue Flow</CardTitle>
              <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Daily trend detection</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl bg-slate-50"><Filter size={16} /></Button>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[300px] w-full bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-end p-8 overflow-hidden group">
               <div className="flex items-end gap-3 w-full h-full">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85, 60, 100].map((h, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-emerald-500/10 hover:bg-emerald-500 transition-all rounded-t-xl group-hover:opacity-80" 
                      style={{ height: `${h}%` }}
                    />
                  ))}
               </div>
               <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Market Dynamics Active</p>
            </div>
          </CardContent>
        </Card>

        {/* TOP SELLERS (4 Columns) */}
        <Card className="lg:col-span-4 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Top Sellers</CardTitle>
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">By unit volume</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {topProducts.map((product) => (
              <div key={product.name} className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[140px]">{product.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.revenue}</p>
                  </div>
                  <Badge className={`px-2 py-0.5 rounded-full font-black text-[8px] uppercase tracking-widest border-none ${
                    product.growth.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {product.growth}
                  </Badge>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-900 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(product.sales / 150) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:bg-emerald-50">
              Full Inventory <ArrowUpRight className="ml-2 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* INSIGHTS ROW: 2-COLUMN SPLIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DEMOGRAPHICS */}
          <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8">
                  <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Pet Segments</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                  <SegmentBar label="Dog Owners" val="65%" color="bg-blue-500" />
                  <SegmentBar label="Cat Owners" val="25%" color="bg-purple-500" />
                  <SegmentBar label="Exotic/Others" val="10%" color="bg-slate-300" />
              </CardContent>
          </Card>

          {/* AI SUGGESTION */}
          <Card className="bg-emerald-950 text-white border-none shadow-2xl rounded-[2.5rem] p-2 overflow-hidden group">
              <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 rounded-xl">
                        <Sparkles size={20} className="text-white animate-pulse" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight text-emerald-100">Smart Growth</CardTitle>
                  </div>
              </CardHeader>
              <CardContent className="px-8 pb-8 pt-4">
                  <p className="text-sm font-medium leading-relaxed text-emerald-100/60 italic">
                    "Based on sales data in <span className="text-white font-black">Kolkata</span>, Puppy Food is trending. We suggest a <span className="text-emerald-400 font-black">10% discount</span> for first-time owners to boost acquisition by 15%."
                  </p>
                  <Button className="w-full h-14 mt-8 bg-emerald-500 hover:bg-white hover:text-emerald-900 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg active:scale-95">
                      Launch AI Campaign
                  </Button>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

// Internal Sub-components
function MetricCard({ title, value, change, isPos, icon: Icon, color }: any) {
  const colors: any = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2.2rem] bg-white transition-all hover:scale-[1.02]">
      <CardContent className="p-8">
        <div className="flex justify-between items-start">
          <div className={`p-3 rounded-2xl ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-widest border-none ${isPos ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {isPos ? <ArrowUpRight className="h-3 w-3 mr-1 inline" /> : <ArrowDownRight className="h-3 w-3 mr-1 inline" />}
            {change}
          </Badge>
        </div>
        <div className="mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <h3 className="text-3xl font-[900] text-slate-900 tracking-tighter mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

function SegmentBar({ label, val, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span>{label}</span>
                <span className="text-slate-900">{val}</span>
            </div>
            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden">
                <div className={`${color} h-full rounded-full transition-all duration-1000`} style={{ width: val }} />
            </div>
        </div>
    );
}