"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Appointment } from "@/typescript/interface/doctor";

export function useDoctorSchedule(doctorId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["doctor-schedule", doctorId],
    queryFn: async () => {
      const [aptRes, settingsRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(
            `
            id,
            appointment_date,
            time_slot,
            status,
            is_online,
            notes,
            pets ( name, breed ),
            owner:register!owner_id ( full_name )
          `,
          )
          .eq("doctor_id", doctorId)
          .order("appointment_date", { ascending: true }),

        supabase
          .from("doctor_settings")
          .select("*")
          .eq("doctor_id", doctorId)
          .maybeSingle(),
      ]);

      if (aptRes.error) throw aptRes.error;
      if (settingsRes.error) throw settingsRes.error;

      const formattedApts: Appointment[] = (aptRes.data || []).map(
        (apt: any) => ({
          id: apt.id,
          petName: apt.pets?.name || "Unknown Pet",
          breed: apt.pets?.breed || "Unknown Breed",
          ownerName: apt.owner?.full_name || "Unknown Owner",
          date: new Date(apt.appointment_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: apt.time_slot,
          type: apt.notes || "General Checkup",
          status: apt.status,
          isOnline: apt.is_online,
        }),
      );

      return {
        appointments: formattedApts,
        settings: settingsRes.data || {
          consultation_fee: 800,
          active_slots: ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM"],
        },
      };
    },
    enabled: !!doctorId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!doctorId) return;

    const channel = supabase
      .channel(`live_schedule_${doctorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: `doctor_id=eq.${doctorId}`,
        },
        (payload) => {
          console.log(
            "⚡ Database change detected! Auto-refreshing data...",
            payload,
          );
          queryClient.invalidateQueries({
            queryKey: ["doctor-schedule", doctorId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, queryClient]);

  return query;
}
