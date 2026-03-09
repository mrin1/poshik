"use client";

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  IndianRupee,
  Save,
  Activity,
  ArrowRight,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { supabase } from "@/utils/supabase";
import { Appointment } from "@/typescript/interface/doctor";

const MASTER_SLOTS = [
  "09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "02:00 PM", "04:30 PM", "06:00 PM"
];



export default function DoctorSchedulePage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultFee, setConsultFee] = useState("0");
  const [activeSlots, setActiveSlots] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: aptData, error: aptError } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          time_slot,
          status,
          is_online,
          notes,
          pets ( name, breed ),
          owner:register!owner_id ( full_name )
        `)
        .eq("doctor_id", user?.id)
        .in("status", ["PENDING", "APPROVED"]) // Fetch active ones
        .order("appointment_date", { ascending: true })
        .limit(10); 

      if (aptError) throw aptError;

      const formattedApts: Appointment[] = (aptData || []).map((apt: any) => ({
        id: apt.id,
        petName: apt.pets?.name || "Unknown Pet",
        breed: apt.pets?.breed || "Unknown Breed",
        ownerName: apt.owner?.full_name || "Unknown Owner",
        date: new Date(apt.appointment_date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
        time: apt.time_slot,
        type: apt.notes || "General Checkup",
        status: apt.status,
        isOnline: apt.is_online,
      }));
      setAppointments(formattedApts);

      const { data: settingsData, error: settingsError } = await supabase
        .from("doctor_settings")
        .select("*")
        .eq("doctor_id", user?.id)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (settingsData) {
        setConsultFee(settingsData.consultation_fee.toString());
        setActiveSlots(settingsData.active_slots || []);
      } else {
  
        setConsultFee("800");
        setActiveSlots(["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM"]);
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED" | "COMPLETED") => {

    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));

    try {
      
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id)
        .select();

      if (error) throw error;
    } catch (err: any) {
      console.error("Status Update Error:", err.message);
      alert("Failed to update appointment. Please refresh.");
      fetchDashboardData(); 
    }
  };

  const toggleSlot = (timeToToggle: string) => {
    if (activeSlots.includes(timeToToggle)) {
      setActiveSlots(activeSlots.filter(t => t !== timeToToggle));
    } else {
      setActiveSlots([...activeSlots, timeToToggle]); 
    }
  };

  const saveSettings = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    
    try {
    
      const { error } = await supabase
        .from("doctor_settings")
        .upsert({
          doctor_id: user.id,
          consultation_fee: Number(consultFee),
          active_slots: activeSlots,
          updated_at: new Date().toISOString()
        }, { onConflict: 'doctor_id' }); 
      
      if (error) throw error;
      alert("Clinic schedule and fees successfully updated!");
    } catch (error: any) {
      console.error("Failed to save settings", error.message);
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
    
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Clinic <br /> Planner
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> 
            {isLoading ? "Syncing data..." : `Managing ${appointments.length} active bookings.`}
          </p>
        </div>
      </div>

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="h-16 inline-flex bg-slate-100 rounded-[1.5rem] p-1.5 mb-8">
          <TabsTrigger value="appointments" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm">
            Active Bookings
          </TabsTrigger>
          <TabsTrigger value="availability" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-blue-600">
            Availability & Fees
          </TabsTrigger>
        </TabsList>

    
        <TabsContent value="appointments" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading bookings...</p>
             </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active bookings found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments.map((apt) => (
                <Card key={apt.id} className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden transition-all hover:scale-[1.01]">
                  <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                        {apt.petName}
                      </CardTitle>
                      <CardDescription className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
                        Owner: {apt.ownerName}
                      </CardDescription>
                    </div>
                    <Badge className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-none ${
                        apt.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : 
                        apt.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      {apt.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="px-8 pb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-blue-500" /> {apt.date}
                      </div>
                      <div className="hidden sm:block text-slate-200">|</div>
                      <div className="flex items-center text-slate-900">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" /> {apt.time}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Reason: <span className="text-slate-900">{apt.type}</span>
                      </span>
                      {apt.isOnline && (
                        <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase tracking-widest">
                          <Video className="h-3 w-3 mr-1.5" /> Video Call
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 flex gap-3">
                    {apt.status === "PENDING" ? (
                      <>
                        <Button variant="ghost" className="flex-1 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(apt.id, "REJECTED")}>
                          <XCircle className="h-4 w-4 mr-2" /> Decline
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-100" onClick={() => handleStatusUpdate(apt.id, "APPROVED")}>
                          <CheckCircle className="h-4 w-4 mr-2" /> Accept
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" className="w-full h-12 rounded-xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest group border border-slate-100 hover:bg-slate-100 transition-colors">
                        Open Consultation Room <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

  
        <TabsContent value="availability" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
      
            <Card className="lg:col-span-5 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-2">
              <CardHeader className="p-8">
                <div className="p-3 rounded-2xl bg-emerald-50 w-fit mb-4">
                  <IndianRupee className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Service Fees</CardTitle>
                <CardDescription className="font-medium text-slate-400 text-xs">Manage your clinical consultation rates.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-4">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Standard Checkup Fee</Label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">₹</span>
                    <Input
                      type="number"
                      value={consultFee}
                      onChange={(e) => setConsultFee(e.target.value)}
                      className="h-16 pl-10 rounded-2xl border-none bg-slate-50 font-black text-2xl focus-visible:ring-2 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-4">
                <Button 
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="w-full h-14 bg-slate-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {isSaving ? "Saving..." : "Save Fee Update"}
                </Button>
              </CardFooter>
            </Card>

        
            <Card className="lg:col-span-7 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="p-8">
                <div className="p-3 rounded-2xl bg-blue-50 w-fit mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Time Management</CardTitle>
                <CardDescription className="font-medium text-slate-400 text-xs">Define your daily window for digital and physical visits.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {MASTER_SLOTS.map((time) => {
                    const isActive = activeSlots.includes(time);
                    return (
                      <div
                        key={time}
                        className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                          isActive ? "border-blue-100 bg-blue-50/20" : "border-slate-50 bg-slate-50/50 grayscale opacity-60"
                        }`}
                      >
                        <span className={`font-black text-xs uppercase tracking-widest ${isActive ? "text-blue-900" : "text-slate-400"}`}>
                          {time}
                        </span>
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => toggleSlot(time)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="px-8 pb-8 pt-0">
                <Button 
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="w-full h-14 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin text-slate-400" /> : <Save className="h-4 w-4 mr-2 text-slate-400" />}
                  Save Schedule
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Label({ children, className }: any) {
  return <label className={`block leading-none ${className}`}>{children}</label>;
}