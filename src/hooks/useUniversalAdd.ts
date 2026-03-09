"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { toast } from "sonner";

type TableName = "products" | "pets" | "appointments";

export function useUniversalAdd(tableName: TableName) {
  const queryClient = useQueryClient();
  
  const user = useAuthStore((state) => state.user); 

  return useMutation({
    mutationFn: async (newData: Record<string, any>) => {

      if (!user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

  
      const roleMapping: Record<string, string> = {
        PET_SHOP: "shop_id",
        PET_DOCTOR: "doctor_id",
        PET_OWNER: "owner_id",
      };

      const roleIdColumn = roleMapping[user.role] || "owner_id";

  
      const payload = {
        ...newData,
        [roleIdColumn]: user.id,
      };

  
      const { data, error } = await supabase
        .from(tableName as string)
        .insert([payload])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
  
      queryClient.invalidateQueries({ queryKey: [tableName] });
      
      toast.success(`${tableName.slice(0, -1)} added successfully!`);
    },
    onError: (err: any) => {
      console.error(`Error adding to ${tableName}:`, err);
      toast.error(err.message || "An unexpected error occurred.");
    }
  });
}