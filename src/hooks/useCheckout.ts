"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCheckout() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const router = useRouter();

  const checkoutMutation = useMutation({
    mutationFn: async ({
      cartItems,
      total,
    }: {
      cartItems: any[];
      total: number;
    }) => {
      if (!user?.id)
        throw new Error("Please log in to complete your purchase.");

      const validItems = cartItems.filter(
        (item) => item?.product_id || item?.products?.id || item?.id,
      );
      if (validItems.length === 0)
        throw new Error("Your cart is empty or missing valid items.");

      const customerName =
        (user as any)?.user_metadata?.full_name ||
        (user as any)?.full_name ||
        user?.email ||
        "Poshik User";

      const itemsSummary = validItems.map((item) => ({
        product_id: item.product_id || item.products?.id || item.id,
        name: item.products?.name || item.name || item.title || "Product",
        quantity: item.quantity || 1,
        price: item.products?.price || item.price || 0,
      }));

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: customerName,
          customer_address: "Address Pending",
          items_summary: itemsSummary,
          total_amount: total,
          status: "PAID",
        })
        .select();

      if (orderError) throw new Error(`Order failed: ${orderError.message}`);
      const order = orderData?.[0];
      if (!order)
        throw new Error(
          "Order was created, but database did not return an ID.",
        );

      const orderItems = validItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id || item.products?.id || item.id,
        quantity: item.quantity || 1,
        price: item.products?.price || item.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (itemsError)
        throw new Error(`Failed to save order items: ${itemsError.message}`);

      return order;
    },
    onSuccess: () => {
      queryClient.setQueryData(["cart", user?.id], []);
      queryClient.invalidateQueries({ queryKey: ["cart", user?.id] });

      toast.success("Payment successful! Order placed.");
    },
    onError: (error: any) => {
      console.error("Checkout Error:", error);
      toast.error(error.message);
    },
  });

  return {
    processCheckout: checkoutMutation.mutate,
    isProcessing: checkoutMutation.isPending,
  };
}
