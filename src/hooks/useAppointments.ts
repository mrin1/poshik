"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Appointment } from "@/typescript/types/appointments";

export function useAppointments(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
   
    queryKey: ["all-appointments", userId],
    queryFn: async (): Promise<Appointment[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          id,
          appointment_date,
          time_slot,
          notes,
          status,
          is_online,
          pet_id,
          pets!inner ( name, breed ),
          owner:register!owner_id ( full_name )
        `)
       
        .order("appointment_date", { ascending: false });

      if (error) throw error;

      return (data || []).map((apt: any) => ({
        id: apt.id,
        petId: apt.pet_id,
        petName: apt.pets?.name || "Unknown Pet",
        breed: apt.pets?.breed || "General",
        ownerName: apt.owner?.full_name || "Unknown Owner",
        date: apt.appointment_date,
        time: apt.time_slot || "TBD",
        type: apt.notes || "General Consultation",
        status: apt.status || "PENDING",
        isOnline: apt.is_online || false,
      }));
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('global_appointments_channel')
      .on(
        "postgres_changes",
        
        { event: "*", schema: "public", table: "appointments" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["all-appointments", userId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-appointments", userId] });
     
      queryClient.invalidateQueries({ queryKey: ["doctor-dashboard", userId] });
    },
  });

  return { ...query, updateStatus };
}