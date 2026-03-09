"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Pet } from "@/typescript/interface/pet";


export function usePetManagement(ownerId: string | undefined) {
  const queryClient = useQueryClient();

  const petsQuery = useQuery({
    queryKey: ["my-pets", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        //.eq("owner_id", ownerId); 

      if (error) throw error;
      return data as Pet[];
    },
    enabled: !!ownerId,
  });

  const addPetMutation = useMutation({
    mutationFn: async (newPet: Partial<Pet>) => {
      const { data, error } = await supabase
        .from("pets")
        .insert([newPet])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-pets", ownerId] });

    },
  });

  return { petsQuery, addPetMutation };
}