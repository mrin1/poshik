// hooks/useProducts.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { Product } from "@/typescript/interface/product";

export function useProducts(category: string = "All", search: string = "") {
  return useQuery({
    queryKey: ["shop-products", category, search],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch products:", error.message);
        throw error;
      }
      return data as Product[];
    },
  });
}
