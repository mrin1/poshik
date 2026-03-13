"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function usePetDiscovery() {
  return useQuery({
    queryKey: ["pet-discovery-live"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select(
          "id, name, breed, lat, lng, location_lat, location_lng, photos, species, privacy_status",
        )

        .or("lat.not.is.null,location_lat.not.is.null");

      if (error) throw error;

      return (data || []).map((pet: any) => ({
        ...pet,

        lat: pet.lat || pet.location_lat,
        lng: pet.lng || pet.location_lng,
        display_image:
          pet.photos && pet.photos.length > 0
            ? pet.photos[0]
            : "https://via.placeholder.com/150?text=No+Photo",
      }));
    },

    staleTime: 0,
    refetchInterval: 5000,
  });
}
