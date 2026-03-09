"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { DashboardData } from "@/typescript/interface/dashboard";

export function useDoctorDashboard(userId: string | undefined) {
  return useQuery<DashboardData | null>({
    queryKey: ["doctor-dashboard", userId],
    queryFn: async () => {
      if (!userId) return null;

      // 1. TIMEZONE FIX: Safely construct local YYYY-MM-DD
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      // 2. OPTIMIZATION: Fetch all queries simultaneously
      const [
        { data: schedule, error: schedError },
        { count: pendingCount },
        { count: totalPetsCount } 
      ] = await Promise.all([
        // Query A: ALL appointments for today (doctor_id filter removed)
        supabase
          .from("appointments")
          .select(`
            id, appointment_date, time_slot, status, is_online, notes,
            pets ( name, breed ), owner:register!owner_id ( full_name )
          `)
          .eq("appointment_date", today)
          .order("time_slot", { ascending: true }),

        // Query B: ALL pending requests across the whole platform
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING"),

        // Query C: Count ALL registered pets directly from the pets table
        supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
      ]);

      if (schedError) {
        console.error("Dashboard Fetch Error:", schedError);
        throw schedError;
      }

      return {
        schedule: (schedule || []).map((apt: any) => ({
          id: apt.id,
          time: apt.time_slot,
          // Added safe fallbacks in case pet/owner data is missing
          petName: apt.pets ? `${apt.pets.name} (${apt.pets.breed})` : "Unknown Pet",
          ownerName: apt.owner?.full_name || "Unknown Owner",
          type: apt.notes || "General Consult",
          isOnline: apt.is_online,
          status: apt.status,
        })),
        stats: {
          appointmentsToday: schedule?.length || 0,
          pendingRequests: pendingCount || 0,
          totalPatients: totalPetsCount || 0, // This will now correctly show all 9 pets
        },
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Caches data for 5 minutes to prevent over-fetching
  });
}