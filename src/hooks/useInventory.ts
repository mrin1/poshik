"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useAuthStore } from "@/zustand/store/useAuthStore";

export function useInventory(shopId: string | undefined) {
  const queryClient = useQueryClient();

  const { user } = useAuthStore();

  const inventoryQuery = useQuery({
    queryKey: ["shop-inventory", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        // .eq("shop_id", shopId) //
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!shopId,
  });

  const addMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      if (!shopId) throw new Error("No active session");

      const payload = {
        ...newProduct,
        shop_id: shopId,
        shop_name: user?.full_name || "Poshik Pet Shop",
      };

      const { error } = await supabase.from("products").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-inventory", shopId] });
      toast.success("Product added successfully!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .eq("shop_id", shopId)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error(
          "Update failed. You might not have permission to edit this.",
        );
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-inventory", shopId] });
      toast.success("Product updated successfully!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("shop_id", shopId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-inventory", shopId] });
      toast.success("Item removed from inventory");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { inventoryQuery, addMutation, updateMutation, deleteMutation };
}
