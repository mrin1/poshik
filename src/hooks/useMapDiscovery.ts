"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { MapPin } from "@/typescript/interface/map";



export function useMapDiscovery() {
  return useQuery({
    queryKey: ["map-discovery"],
    queryFn: async () => {
    
      const { data: pets } = await supabase
        .from("pets")
        .select("id, name, species, breed, location_lat, location_lng")
        .eq("is_discoverable", true);


      const { data: vets } = await supabase
        .from("register")
        .select("id, full_name, role")
        .eq("role", "DOCTOR")
        .eq("kyc_status", "APPROVED");

      const mapItems: MapPin[] = [];

    
      if (pets) {
        pets.forEach(pet => {
          mapItems.push({
            id: pet.id,
            title: pet.name,
            category: "Pet",
            location: `${pet.species} • ${pet.breed}`,
            status: "Active Nearby",
            color: "emerald",
            lat: pet.location_lat || 22.5726,
            lng: pet.location_lng || 88.3639,
          });
        });
      }

  
      if (vets) {
        vets.forEach((vet, index) => {
          mapItems.push({
            id: vet.id,
            title: vet.full_name,
            category: "Clinic",
            location: "Kolkata, WB", 
            rating: 4.8,
            status: "Verified Vet",
            color: "blue",
            lat: 22.5726 + (index * 0.005), 
            lng: 88.3639 - (index * 0.005),
          });
        });
      }

      return mapItems;
    }
  });
}