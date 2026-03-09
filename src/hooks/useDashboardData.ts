"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useDashboardData(userId: string | undefined) {
  return useQuery({
    queryKey: ["owner-dashboard", userId],
    queryFn: async () => {
      if (!userId) return null;

      const [pets, appointments, orders] = await Promise.all([
        supabase.from("pets").select("id", { count: "exact" }).eq("owner_id", userId),
        supabase.from("appointments")
          .select("*, pet:pets(name)")
          .eq("owner_id", userId)
          .gte("appointment_date", new Date().toISOString())
          .order("appointment_date", { ascending: true })
          .limit(1),
        supabase.from("orders")
          .select("*")
          .eq("owner_id", userId)
          .order("created_at", { ascending: false })
          .limit(3)
      ]);

      return {
        stats: {
          totalPets: pets.count || 0,
          upcomingCount: appointments.data?.length || 0,
          activeOrders: orders.data?.filter(o => o.status !== 'DELIVERED').length || 0
        },
        nextAppointment: appointments.data?.[0] || null,
        recentOrders: orders.data || []
      };
    },
    enabled: !!userId,
  });
}