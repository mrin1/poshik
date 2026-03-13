"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useShopDashboard(shopId: string | undefined) {
  return useQuery({
    queryKey: ["shop-dashboard", shopId],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        // .eq("shop_id", shopId)
        .order("created_at", { ascending: false });

      const validOrders = orders || [];

      const totalRevenue = validOrders.reduce(
        (sum, o) => sum + (Number(o.total_amount) || 0),
        0,
      );

      const formatRupee = (amount: number) =>
        new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(amount);

      const formattedRecentOrders = validOrders.slice(0, 5).map((o: any) => ({
        id: `ORD-${o.id?.toString().slice(0, 4).toUpperCase() || "XXXX"}`,

        customer: "Store Customer",
        item: "Purchased Items",
        price: formatRupee(o.total_amount || 0),
        status: o.status || "PENDING",
      }));

      return {
        shopName: "My Store",
        stats: {
          revenue: formatRupee(totalRevenue),
          orders: validOrders.length.toString(),
          customers: validOrders.length.toString(),
          lowStock: "00",
        },
        recentOrders: formattedRecentOrders,
        payout: formatRupee(totalRevenue * 0.8),
      };
    },
    enabled: !!shopId,
  });
}
