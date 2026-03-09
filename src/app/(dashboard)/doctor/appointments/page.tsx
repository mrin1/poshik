"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, CalendarDays, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useAppointments } from "@/hooks/useAppointments";
import { StatusBadge } from "@/components/appointments/StatusBadge";
import { AppointmentActions } from "@/components/appointments/AppointmentActions";

export default function DoctorAppointmentsPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const { data: appointments, isLoading, updateStatus } = useAppointments(user?.id);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");


  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = useMemo(() => {
    return (appointments || []).filter((apt) => {
      const matchesSearch = apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            apt.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, appointments]);

  if (!mounted) return null; 

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <header className="flex flex-col gap-2">
        <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900">Archive</h1>
        <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-blue-600" /> 
          {isLoading ? "Syncing..." : `${filteredData.length} records found.`}
        </p>
      </header>

      <Card className="rounded-[2rem] border-none shadow-lg">
        <CardContent className="p-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search..." 
              className="pl-12 h-14 rounded-xl border-none bg-slate-50 font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-[180px] rounded-xl border-none bg-slate-100 font-black uppercase text-[10px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All History</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="px-8 py-6 text-[10px] font-black uppercase text-slate-400">Patient</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase text-slate-400">Schedule</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase text-slate-400">Status</TableHead>
              <TableHead className="px-8 py-6 text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
            ) : filteredData.map((apt) => (
              <TableRow key={apt.id} className="hover:bg-slate-50/50">
                <TableCell className="px-8 py-6">
                  <div className="font-black text-sm uppercase">{apt.petName}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{apt.breed} • {apt.ownerName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-bold">{new Date(apt.date).toLocaleDateString()}</div>
                  <div className="text-[9px] font-black text-blue-600 uppercase mt-1">{apt.time}</div>
                </TableCell>
                <TableCell><StatusBadge status={apt.status} /></TableCell>
                <TableCell className="px-8 text-right">
                  <AppointmentActions 
                    id={apt.id} 
                    status={apt.status} 
                    onUpdateStatus={(id, status) => updateStatus.mutate({ id, newStatus: status })} 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}