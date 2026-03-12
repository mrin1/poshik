"use client";

import { useState } from "react";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import { useVets } from "@/hooks/vets"; 
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { toast } from "sonner"; 
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Star,
  Search,
  Filter,
  Video,
  ChevronRight,
  Loader2, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VetCardProps } from "@/typescript/interface/vet";




const SPECIALTIES = ["General", "Surgery", "Dermatology", "Nutrition", "Emergency"];

export default function VetsDirectoryPage() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All"); 
  
  const { user } = useAuthStore(); 
  const { data: vets, isLoading, isError } = useVets(search);

  const filteredVets = vets?.filter((vet: any) => {
    if (selectedSpecialty === "All") return true;
    return vet.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase());
  });

  const handleBookAppointment = (vetName: string) => {
    if (!user) {
      return toast.error("Authentication Required", {
        description: `Please login to book an appointment with Dr. ${vetName}`,
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        },
      });
    }

    toast.success(`Opening calendar for Dr. ${vetName}...`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
        <section className="bg-blue-50/50 border-b border-blue-100 py-16 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700 border-none px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                  Professional Care
                </Badge>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  VET CLINICS
                </h1>
                <p className="text-slate-500 max-w-lg font-medium">
                  Every veterinarian is KYC verified and certified to provide
                  the best care for your pets.
                </p>
              </div>
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)} 
                  className="pl-12 rounded-2xl bg-white border-none h-12 shadow-md focus-visible:ring-blue-500 font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              <Button 
                onClick={() => setSelectedSpecialty("All")}
                className={`rounded-xl px-8 font-bold h-11 transition-all ${
                  selectedSpecialty === "All" ? "bg-blue-600 text-white" : "bg-white text-slate-400 border-slate-200"
                }`}
                variant={selectedSpecialty === "All" ? "default" : "outline"}
              >
                All Doctors
              </Button>
              {SPECIALTIES.map((spec) => (
                <Button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  variant={selectedSpecialty === spec ? "default" : "outline"}
                  className={`rounded-xl border-slate-200 px-8 font-bold h-11 transition-all ${
                    selectedSpecialty === spec 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {spec}
                </Button>
              ))}
              <Button variant="ghost" className="rounded-xl px-4 text-slate-300 hover:text-blue-600">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-20 space-y-10 min-h-[500px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
              <p className="font-bold uppercase tracking-widest text-xs">Finding best doctors...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest">
              Failed to load doctors. Please try again.
            </div>
          ) : filteredVets?.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">
              No doctors found matching "{search || selectedSpecialty}"
            </div>
          ) : (
            filteredVets?.map((vet: any) => (
              <VetCard
                key={vet.id}
                image={vet.profile_image_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000"} 
                name={vet.full_name}
                specialty={vet.specialty || "General Veterinarian"} 
                location={vet.address || "Online Consultation"}
                rating="5.0" 
                reviews="0"
                online={true} 
                onBook={() => handleBookAppointment(vet.full_name)}
              />
            ))
          )}
        </section>

        <section className="bg-slate-950 py-16 mb-0">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-8">
              <div className="h-16 w-16 bg-red-600 rounded-3xl flex items-center justify-center animate-pulse shadow-xl shadow-red-900/50">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                  Emergency Care?
                </h2>
                <p className="text-slate-400 text-sm font-medium italic">
                  Find nearest open clinics for urgent pet issues.
                </p>
              </div>
            </div>
            <Button className="bg-white text-slate-950 hover:bg-orange-600 hover:text-white font-black h-12 px-10 rounded-2xl transition-all">
              Get Immediate Help
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function VetCard({ image, name, specialty, location, rating, reviews, online, onBook }: VetCardProps) {
  return (
    <div className="group bg-white p-8 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-10 items-center shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className="relative">
        <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700 ring-4 ring-slate-50">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
          />
        </div>
        {online && (
          <div title="Online for Consultations" className="absolute -top-1 -right-1">
            <div className="bg-emerald-500 h-6 w-6 rounded-full border-4 border-white animate-pulse shadow-lg" />
          </div>
        )}
      </div>

      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {name}
          </h2>
          <div title="Verified Professional">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <p className="text-blue-600 font-black text-sm tracking-wide uppercase italic">
          {specialty}
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-blue-400" /> {location}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-wider">
            <Star className="h-4 w-4 text-amber-500 fill-current" /> {rating} ({reviews} Reviews)
          </div>
        </div>

        {online && (
          <div className="inline-flex items-center gap-2 text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg">
            <Video className="h-3 w-3" /> Live Consultation Available
          </div>
        )}
      </div>

      <div className="w-full md:w-auto flex flex-col gap-3">
        <Button 
          onClick={onBook} 
          className="bg-blue-600 hover:bg-slate-950 h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          Book Appointment
        </Button>
        <Button variant="ghost" className="text-slate-300 font-black uppercase tracking-widest text-[9px] hover:text-blue-600 transition-colors">
          Medical Archive <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}