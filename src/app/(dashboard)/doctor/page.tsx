"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Calendar,
  Users,
  Clock,
  Video,
  MessageSquare,
  ArrowRight,
  Activity,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";

export default function DoctorDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const { data, isLoading } = useDoctorDashboard(user?.id);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Clinic <br /> Dashboard
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> Welcome back,{" "}
            {user?.full_name || "Doctor"}.
          </p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
          Clinic Status: Open
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Today's Appointments"
          value={isLoading ? "..." : (data?.stats?.appointmentsToday ?? 0)}
          sub="On Schedule"
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Pending Requests"
          value={isLoading ? "..." : (data?.stats?.pendingRequests ?? 0)}
          sub="Action Required"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          color="amber"
          highlight={(data?.stats?.pendingRequests ?? 0) > 0}
        />
        <MetricCard
          title="Total Patients"
          value={isLoading ? "..." : (data?.stats?.totalPatients ?? 0)}
          sub="Growth Tracked"
          icon={<Users className="h-5 w-5 text-emerald-600" />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card className="lg:col-span-8 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white">
          <CardHeader className="flex flex-row items-center justify-between p-8 bg-slate-50/50 rounded-t-[2.5rem]">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight">
                Today's Schedule
              </CardTitle>
              <CardDescription className="font-medium text-slate-400 uppercase text-[10px] tracking-widest mt-1">
                {new Date().toLocaleDateString("en-IN", {
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Link href="/doctor/appointments">
              <Button
                variant="ghost"
                className="font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-blue-600"
              >
                Manage All <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : data?.schedule.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs">
                No appointments scheduled for today.
              </div>
            ) : (
              <div className="space-y-4">
                {data?.schedule.map((apt: any) => (
                  <div
                    key={apt.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2rem] bg-slate-50 hover:bg-blue-50/30 transition-all border border-transparent hover:border-blue-100 group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center justify-center bg-white shadow-sm border text-blue-700 font-black px-4 py-3 rounded-2xl text-xs min-w-[100px]">
                        {apt.time}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">
                          {apt.petName}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          Owner: {apt.ownerName} •{" "}
                          <span className="text-blue-600">{apt.type}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 sm:mt-0">
                      {apt.isOnline && (
                        <Button className="h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">
                          <Video className="h-4 w-4 mr-2" /> Start Call
                        </Button>
                      )}
                      <Link href="/doctor/messages">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-xl bg-white text-slate-400 hover:text-blue-600 shadow-sm"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-slate-950 text-white rounded-[2.5rem] border-none shadow-2xl p-2">
            <CardHeader className="p-8 pb-4 text-center">
              <div className="mx-auto bg-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center mb-4">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-[900] uppercase tracking-tighter">
                Clinic Health
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-3">
              <Link href="/doctor/appointments">
                <Button className="w-full h-14 bg-white hover:bg-blue-50 text-slate-950 font-black uppercase tracking-widest rounded-2xl flex justify-between px-6">
                  Review Requests{" "}
                  <Badge className="bg-blue-600 text-white">
                    {data?.stats.pendingRequests}
                  </Badge>
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-slate-400 font-black uppercase tracking-widest rounded-2xl flex justify-between px-6"
              >
                Consultation Logs <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon,
  color,
  highlight = false,
}: any) {
  return (
    <Card
      className={`border-none shadow-lg rounded-[2.5rem] transition-all hover:scale-[1.02] ${highlight ? "ring-2 ring-amber-500/20 bg-amber-50/10" : "bg-white"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {title}
        </CardTitle>
        <div className={`p-3 rounded-2xl bg-slate-50`}>{icon}</div>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="text-4xl font-black text-slate-900 tracking-tighter">
          {value}
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
          {sub}
        </p>
      </CardContent>
    </Card>
  );
}
