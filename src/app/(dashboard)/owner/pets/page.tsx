"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { usePetManagement } from "@/hooks/usePetManagement";
import { 
  Plus, Heart, Activity, Calendar, ChevronRight, 
  ShieldCheck, Scale, Clock, Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function OwnerPetsPage() {
  const { user } = useAuthStore();
  const { petsQuery, addPetMutation } = usePetManagement(user?.id);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    species: "Dog", 
    breed: "",
    age: "",
    weight: "",
    gender: "Male"
  });

  useEffect(() => setMounted(true), []);

  const handleAddPet = async () => {
    if (!user?.id) return;

    const newPetData = {
      owner_id: user.id, 
      name: formData.name,
      species: formData.species, 
      breed: formData.breed,
      age_years: parseInt(formData.age) || 0, 
      gender: formData.gender,
      weight_kg: parseFloat(formData.weight) || 0, 
      is_discoverable: true, 
      location_lat: 22.5726, 
      location_lng: 88.3639,
    };

    addPetMutation.mutate(newPetData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ name: "", species: "Dog", breed: "", age: "", weight: "", gender: "Male" });
        toast.success("Family member registered successfully!");
      },
      onError: (err: any) => toast.error(`Registration Failed: ${err.message}`)
    });
  };

  if (!mounted || petsQuery.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
     
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">Pet <br /> Families</h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-orange-600" /> Manage your companions under one account[cite: 46].
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 bg-slate-950 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl">
              <Plus className="h-5 w-5 mr-2" strokeWidth={3} /> Add New Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-10 bg-white">
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-[900] uppercase tracking-tighter">New Family Member</DialogTitle>
              <DialogDescription className="text-slate-500">Provide pet details to start their health passport[cite: 48].</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Input placeholder="Pet Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
              <Select onValueChange={(val) => setFormData({...formData, species: val})} value={formData.species}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none"><SelectValue placeholder="Species" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Breed" value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} className="h-12 rounded-xl" />
              <Input type="number" placeholder="Age (Years)" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="h-12 rounded-xl" />
              <Input type="number" placeholder="Weight (Kg)" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="h-12 rounded-xl" />
              <Select onValueChange={(val: any) => setFormData({...formData, gender: val})} value={formData.gender}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none"><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
              </Select>
            </div>
            <Button 
              disabled={addPetMutation.isPending} 
              onClick={handleAddPet} 
              className="w-full h-14 bg-slate-950 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl mt-6"
            >
              {addPetMutation.isPending ? "Registering..." : "Confirm Registration"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {petsQuery.data?.map((pet) => (
          <Card key={pet.id} className="group border-none shadow-xl rounded-[2.5rem] bg-white transition-all hover:scale-[1.02] overflow-hidden">
            <div className={`h-32 relative bg-gradient-to-br ${pet.gender === 'Male' ? 'from-blue-600 to-indigo-700' : 'from-pink-500 to-rose-600'}`}>
               <div className="absolute top-6 right-6">
                <Badge className="bg-white/20 text-white border-none backdrop-blur-md font-black text-[9px] uppercase px-3 py-1 rounded-full">
                  {pet.is_discoverable ? "Discoverable" : "Private"} [cite: 49]
                </Badge>
              </div>
            </div>
            <div className="px-8 relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl rounded-[1.8rem] -mt-12">
                  <AvatarFallback className="bg-slate-900 text-white font-[900] text-2xl">{pet.name[0]}</AvatarFallback>
                </Avatar>
                <div className="mt-6">
                  <CardTitle className="text-3xl font-[900] uppercase tracking-tighter text-slate-900">{pet.name}</CardTitle>
                  <CardDescription className="text-xs font-bold text-blue-600 uppercase mt-1">{pet.species} • {pet.breed}</CardDescription>
                </div>
            </div>
            <CardContent className="px-8 mt-8 space-y-6">
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-[1.8rem]">
                <MetricItem label="Years" val={pet.age_years} icon={<Clock size={12} />} />
                <MetricItem label="Kg" val={pet.weight_kg} icon={<Scale size={12} />} />
                <MetricItem label="Sex" val={pet.gender} icon={<Activity size={12} />} />
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest group-hover:border-blue-600">
                View Medical Records [cite: 48, 52] <ChevronRight className="ml-2 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricItem({ label, val, icon }: any) {
    return (
        <div className="text-center">
            <p className="text-[8px] font-black text-slate-300 uppercase flex items-center justify-center gap-1">{icon} {label}</p>
            <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{val}</p>
        </div>
    );
}