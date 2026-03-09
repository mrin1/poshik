"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Search, MapPin, Star, Clock, Stethoscope, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { usePetOwnerBooking, Doctor } from "@/hooks/usePetOwnerBooking";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const specialties = ["All", "General Practice", "Dermatology", "Surgery", "Dentistry"];
const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

export default function VetAppointmentsPage() {
  const { user } = useAuthStore();
  const { doctorsQuery, petsQuery, createAppointment } = usePetOwnerBooking(user?.id);
  
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>("");

  useEffect(() => setMounted(true), []);

  const filteredDoctors = useMemo(() => {
    if (!doctorsQuery.data) return [];
    return doctorsQuery.data.filter((doc) => {
      const matchesSearch = doc.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === "All" || doc.specialty === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty, doctorsQuery.data]);

  const handleOpenBooking = useCallback((doc: Doctor) => {
    setSelectedDoc(doc);
    setIsBookingOpen(true);
  }, []);

  const handleConfirmBooking = async () => {

    if (!user?.id) {
        toast.error("Please login to book an appointment.");
        return;
    }

    if (!selectedDoc?.id || !date || !selectedTime || !selectedPetId) {
      toast.error("Missing selection: Please pick a pet, date, and time.");
      return;
    }

    createAppointment.mutate({
      doctor_id: selectedDoc.id,
      pet_id: selectedPetId,
      date: format(date, "yyyy-MM-dd"), 
      time: selectedTime
    }, {
      onSuccess: () => {
        setIsBookingOpen(false);
        toast.success("Appointment Requested Successfully!");
        setDate(undefined);
        setSelectedTime(null);
        setSelectedPetId("");
      },
      onError: (err: any) => {
        toast.error(`Booking Failed: ${err.message || "Please check your network."}`);
      }
    });
  };

  if (!mounted || doctorsQuery.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
  
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">Find <br /> A Vet</h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-orange-600" /> 
            Verified medical consultations for your pets[cite: 7, 13].
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search Name or Location..." 
              className="h-14 pl-12 rounded-2xl border-none bg-white shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="h-14 w-full sm:w-[180px] rounded-2xl bg-white shadow-lg font-black text-[10px] uppercase tracking-widest">
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map(s => <SelectItem key={s} value={s} className="font-bold text-xs uppercase">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredDoctors.map((doc) => (
          <Card key={doc.id} className="border-none shadow-xl rounded-[2.5rem] bg-white transition-all hover:scale-[1.01]">
            <CardHeader className="p-8 pb-4">
              <div className="flex gap-5 items-start">
                <Avatar className="h-20 w-20 rounded-3xl border-4 border-slate-50 shadow-sm">
                  <AvatarFallback className="bg-blue-600 text-white font-[900] text-xl">
                    {doc.full_name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-xl font-[900] uppercase tracking-tighter text-slate-900">{doc.full_name}</CardTitle>
                  <CardDescription className="flex items-center text-blue-600 font-black uppercase text-[10px] tracking-widest">
                    <Stethoscope className="h-3 w-3 mr-1.5" /> {doc.specialty || "Pet Doctor"}
                  </CardDescription>
                  <div className="flex items-center gap-1.5 pt-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-slate-900">{doc.rating || 4.8}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 p-3 rounded-2xl">
                <MapPin className="h-4 w-4 mr-3 text-blue-500" /> {doc.location || "Kolkata, WB"}
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex items-center justify-between">
              <div>
                <span className="text-2xl font-[900] text-slate-900 tracking-tighter">₹{doc.fee || 800}</span>
              </div>
              <Button 
                onClick={() => handleOpenBooking(doc)}
                className="h-14 px-8 rounded-2xl bg-slate-950 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-xl"
              >
                Book Visit <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[650px] border-none rounded-[3.5rem] p-0 overflow-hidden bg-white shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="bg-slate-900 p-8 text-white">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-[900] uppercase tracking-tighter leading-none">Schedule <br /> Appointment</DialogTitle>
                <DialogDescription className="text-slate-400 font-medium pt-2 text-xs uppercase tracking-widest">
                    Consultation with {selectedDoc?.full_name} [cite: 80]
                </DialogDescription>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-2xl bg-white/5 border-none text-white font-bold"
                disabled={(d) => d < new Date(new Date().setHours(0,0,0,0))}
              />
            </div>

            <div className="p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-blue-600" /> Select Patient Pet [cite: 50]
                  </h4>
                  <Select onValueChange={setSelectedPetId} value={selectedPetId}>
                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 shadow-inner">
                      <SelectValue placeholder="Select Patient Pet" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      {petsQuery.data?.map(pet => (
                        <SelectItem key={pet.id} value={pet.id} className="font-bold text-xs uppercase cursor-pointer">
                            {pet.name} ({pet.breed}) [cite: 48]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" /> Choose Time Slot [cite: 82, 83]
                  </h4>
                  <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        type="button" 
                        variant={selectedTime === time ? "default" : "outline"}
                        className={`h-12 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                          selectedTime === time 
                            ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]" 
                            : "hover:bg-blue-50 border-slate-100 text-slate-600"
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  className="w-full h-16 rounded-[1.8rem] bg-orange-600 hover:bg-orange-700 text-white font-[900] uppercase tracking-widest text-xs shadow-xl disabled:opacity-30 transition-all active:scale-[0.98]" 
                  disabled={!date || !selectedTime || !selectedPetId || createAppointment.isPending}
                  onClick={handleConfirmBooking}
                >
                  {createAppointment.isPending ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Confirm Appointment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}