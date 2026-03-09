"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

export function useCartData() {
  const [localCart, setLocalCart] = useState<{ id: string; quantity: number }[]>([]);


  useEffect(() => {
    const saved = localStorage.getItem("poshik_cart");
    if (saved) setLocalCart(JSON.parse(saved));
  }, []);

  const query = useQuery({
    queryKey: ["cart-details", localCart],
    queryFn: async () => {
      if (localCart.length === 0) return [];

      const ids = localCart.map((item) => item.id);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);

      if (error) throw error;


      return data.map((product) => ({
        ...product,
        quantity: localCart.find((item) => item.id === product.id)?.quantity || 1,
      }));
    },
    enabled: localCart.length > 0,
  });

  const updateLocalQuantity = (id: string, newQty: number) => {
    const updated = localCart.map(item => item.id === id ? { ...item, quantity: newQty } : item);
    setLocalCart(updated);
    localStorage.setItem("poshik_cart", JSON.stringify(updated));
  };

  const removeLocalItem = (id: string) => {
    const updated = localCart.filter(item => item.id !== id);
    setLocalCart(updated);
    localStorage.setItem("poshik_cart", JSON.stringify(updated));
  };

  return { 
    cartItems: query.data || [], 
    isLoading: query.isLoading, 
    updateLocalQuantity, 
    removeLocalItem 
  };
}