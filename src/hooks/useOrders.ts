"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

export function useOrders(shopId: string | undefined) {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["shop-orders", shopId],
    queryFn: async () => {
      if (!shopId) return [];
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        // .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!shopId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shop-orders", shopId] });
      toast.success(`Order ${data.status.toLowerCase()} successfully!`);
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { ordersQuery, updateStatusMutation };
}
