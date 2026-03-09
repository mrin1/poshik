"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, ExternalLink, MoreVertical, Activity, MapPin, User, ArrowUpRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns"; // Recommended for date formatting

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

export default function ShopOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const { user } = useAuthStore();
  const { ordersQuery, updateStatusMutation } = useOrders(user?.id);
  const { data: orders, isLoading } = ordersQuery;

  useEffect(() => setMounted(true), []);

  // Compute Stats Dynamically from Live Data
  const stats = useMemo(() => {
    if (!orders) return { pending: 0, logistics: 0, sales: 0 };
    return {
      pending: orders.filter(o => o.status === "PENDING").length,
      logistics: orders.filter(o => o.status === "SHIPPED").length,
      sales: orders.reduce((acc, curr) => acc + Number(curr.total_amount), 0),
    };
  }, [orders]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const matchesTab = activeTab === "all" || order.status.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch = order.customer_name.toLowerCase().includes(search.toLowerCase()) || 
                            order.id.toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, search, orders]);

  const getStatusBadge = (status: string) => {
    const variants: any = {
      PENDING: "bg-amber-50 text-amber-600",
      SHIPPED: "bg-blue-50 text-blue-600",
      DELIVERED: "bg-emerald-50 text-emerald-600"
    };
    const labels: any = { PENDING: "Awaiting", SHIPPED: "Transit", DELIVERED: "Success" };
    
    return (
      <Badge className={`${variants[status]} border-none font-black text-[9px] uppercase tracking-widest px-3 py-1`}>
        {labels[status]}
      </Badge>
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Order <br /> Fulfillment
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" /> Managing demand for {user?.full_name}.
          </p>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OrderStatCard label="Incoming Orders" val={stats.pending} icon={<Clock />} color="orange" />
        <OrderStatCard label="In Logistics" val={stats.logistics} icon={<Package />} color="blue" />
        <OrderStatCard label="Gross Sales" val={`₹${stats.sales.toLocaleString()}`} icon={<ArrowUpRight />} color="emerald" />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <TabsList className="h-14 bg-slate-100 rounded-2xl p-1.5">
              <TabsTrigger value="all" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">All Flow</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">Pending</TabsTrigger>
              <TabsTrigger value="shipped" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">Transit</TabsTrigger>
              <TabsTrigger value="delivered" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">Delivered</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <Input 
                placeholder="Search Orders..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-14 pl-12 rounded-2xl border-none bg-slate-50 font-bold" 
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
               <div className="py-24 flex flex-col items-center gap-4">
                 <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Logistics...</p>
               </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6 px-8">Order ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Customer</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">SKU Items</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Billing</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Status</TableHead>
                    <TableHead className="text-right py-6 px-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                        <Package className="h-10 w-10 mx-auto mb-3 opacity-20" /> No Orders Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="py-6 px-8">
                          <div className="font-black text-slate-900 uppercase tracking-tight text-sm">#{order.id.slice(0, 8)}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {format(new Date(order.created_at), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-400"><User size={14} /></div>
                            <div className="font-bold text-slate-900 text-xs uppercase tracking-tight">{order.customer_name}</div>
                          </div>
                          <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 flex items-center gap-1">
                            <MapPin size={10} /> {order.customer_address}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-[10px] font-bold text-slate-600 line-clamp-1 max-w-[180px]">{order.items_summary}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-[900] text-slate-900 tracking-tighter">₹{order.total_amount}</div>
                          <div className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em]">{order.payment_status}</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right py-6 px-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                                <MoreVertical size={18} className="text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Logistics Control</DropdownMenuLabel>
                              <DropdownMenuItem className="rounded-xl font-bold text-sm py-3 px-4 focus:bg-slate-50"><ExternalLink className="mr-3 h-4 w-4" /> Order Details</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-50" />
                              {order.status === "PENDING" && (
                                <DropdownMenuItem 
                                  onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "SHIPPED" })}
                                  className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 px-4 text-blue-600 focus:bg-blue-50"
                                >
                                  <Truck className="mr-3 h-4 w-4" /> Ship Now
                                </DropdownMenuItem>
                              )}
                              {order.status === "SHIPPED" && (
                                <DropdownMenuItem 
                                  onClick={() => updateStatusMutation.mutate({ orderId: order.id, status: "DELIVERED" })}
                                  className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3 px-4 text-emerald-600 focus:bg-emerald-50"
                                >
                                  <CheckCircle2 className="mr-3 h-4 w-4" /> Confirm Delivery
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

// Internal Stat Mini-Component
function OrderStatCard({ label, val, icon, color }: any) {
  const colors: any = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return (
    <Card className="border-none shadow-lg rounded-[2rem] bg-white overflow-hidden">
      <CardContent className="p-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-[900] text-slate-900 tracking-tighter">{val}</p>
        </div>
        <div className={`p-4 rounded-2xl ${colors[color]}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}