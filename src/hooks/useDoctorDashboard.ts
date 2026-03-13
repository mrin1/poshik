"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { DashboardData } from "@/typescript/interface/dashboard";

export function useDoctorDashboard(userId: string | undefined) {
  return useQuery<DashboardData | null>({
    queryKey: ["doctor-dashboard", userId],
    queryFn: async () => {
      if (!userId) return null;

      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const [
        { data: schedule, error: schedError },
        { count: pendingCount },
        { count: totalPetsCount },
      ] = await Promise.all([
        supabase
          .from("appointments")
          .select(
            `
            id, appointment_date, time_slot, status, is_online, notes,
            pets ( name, breed ), owner:register!owner_id ( full_name )
          `,
          )
          .eq("appointment_date", today)
          .order("time_slot", { ascending: true }),

        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("status", "PENDING"),

        supabase.from("pets").select("*", { count: "exact", head: true }),
      ]);

      if (schedError) {
        console.error("Dashboard Fetch Error:", schedError);
        throw schedError;
      }

      return {
        schedule: (schedule || []).map((apt: any) => ({
          id: apt.id,
          time: apt.time_slot,

          petName: apt.pets
            ? `${apt.pets.name} (${apt.pets.breed})`
            : "Unknown Pet",
          ownerName: apt.owner?.full_name || "Unknown Owner",
          type: apt.notes || "General Consult",
          isOnline: apt.is_online,
          status: apt.status,
        })),
        stats: {
          appointmentsToday: schedule?.length || 0,
          pendingRequests: pendingCount || 0,
          totalPatients: totalPetsCount || 0,
        },
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
