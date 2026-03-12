"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useHomeData() {
  return useQuery({
    queryKey: ["home-data-v2"],
    queryFn: async () => {

      const [pets, vets, shops, owners, eventsResponse] = await Promise.all([
        supabase.from("pets").select("*", { count: "exact", head: true }),
        supabase
          .from("register")
          .select("*", { count: "exact", head: true })
          .eq("role", "DOCTOR"),
        supabase
          .from("register")
          .select("*", { count: "exact", head: true })
          .eq("role", "SHOP"),
        supabase
          .from("register")
          .select("*", { count: "exact", head: true })
          .eq("role", "USER"),
        supabase
          .from("events")
          .select("*")
          .eq("status", "APPROVED")
          .order("date", { ascending: true })
          .limit(3),
      ]);

      return {
        stats: {
          pets: pets.count || 0,
          vets: vets.count || 0,
          shops: shops.count || 0,
          owners: owners.count || 0,
        },
        events: (eventsResponse.data as any[]) || [], 
      };
    },
    staleTime: 0,
  });
}