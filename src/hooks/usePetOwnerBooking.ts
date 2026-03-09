"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  specialty?: string;
  location?: string;
  fee?: number;
  rating?: number;
  reviews?: number;
}

export function usePetOwnerBooking(ownerId: string | undefined) {
  const queryClient = useQueryClient();

  const doctorsQuery = useQuery({
    queryKey: ["verified-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("register")
        .select("id, full_name, email")
        .eq("role", "DOCTOR")
        .eq("kyc_status", "APPROVED");

      if (error) throw error;
      
      return data.map((doc) => ({
        ...doc,
        specialty: "General Practice",
        location: "Kolkata, WB",
        fee: 800,
        rating: 4.8,
        reviews: Math.floor(Math.random() * 100) + 10,
      })) as Doctor[];
    },
  });

  const petsQuery = useQuery({
    queryKey: ["owner-pets", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const { data, error } = await supabase
        .from("pets")
        .select("id, name, breed")
        .eq("owner_id", ownerId);
      if (error) throw error;
      return data;
    },
    enabled: !!ownerId,
  });


  const createAppointment = useMutation({
    mutationFn: async (vars: { 
      doctor_id: string; 
      pet_id: string; 
      date: string; 
      time: string 
    }) => {
      const { error } = await supabase.from("appointments").insert([{
        owner_id: ownerId,
        doctor_id: vars.doctor_id,
        pet_id: vars.pet_id,
        appointment_date: vars.date,
        time_slot: vars.time,
        status: "PENDING"
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-appointments"] });
    },
  });

  return { doctorsQuery, petsQuery, createAppointment };
}