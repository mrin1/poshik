// hooks/useCart.ts
"use client";

import { CartItem } from "@/typescript/interface/cart";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("poshik_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  const addToCart = (productId: string, stock: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);

      if (existingItem && existingItem.quantity >= stock) {
        toast.error("Maximum stock reached for this item.");
        return prevCart;
      }

      const newCart = existingItem
        ? prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...prevCart, { id: productId, quantity: 1 }];

      localStorage.setItem("poshik_cart", JSON.stringify(newCart));
      toast.success("Added to cart!");
      return newCart;
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return { cart, addToCart, cartCount, isLoaded };
}
