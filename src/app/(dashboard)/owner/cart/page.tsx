"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCartData } from "@/hooks/useCartData";
import { CartItem } from "@/components/shop/CartItem";
import { Button } from "@/components/ui/button";

export default function CartPage() {
 
  const [mounted, setMounted] = useState(false);
  const { cartItems, isLoading, updateLocalQuantity, removeLocalItem } =
    useCartData();

  useEffect(() => setMounted(true), []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-2">
          <Link
            href="/shop"
            className="text-slate-400 hover:text-emerald-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Shop
          </Link>
          <h1 className="text-6xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Your <br /> Basket
          </h1>
        </header>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/50">
            <ShoppingBag className="h-20 w-20 text-slate-100 mx-auto mb-6" />
            <p className="font-black uppercase tracking-widest text-slate-400">
              Your basket is feeling lonely
            </p>
            <Button

              asChild
              className="mt-8 rounded-2xl bg-slate-950 font-black uppercase tracking-widest text-[10px] h-14 px-10"
            >
              <Link href={"/owner/shop"}>Go Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdate={updateLocalQuantity}
                  onRemove={removeLocalItem}
                />
              ))}
            </div>

            {/* Sticky Checkout Summary */}
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl sticky top-8 transition-all">
              <h2 className="text-2xl font-[900] uppercase tracking-tighter mb-8 italic">
                Summary
              </h2>

              <div className="space-y-4 border-b border-white/10 pb-8">
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-black">Free</span>
                </div>
              </div>

              <div className="pt-8 mb-8 flex justify-between items-end">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  Total
                </span>
                <span className="text-4xl font-[900] tracking-tighter">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Button className="w-full h-16 rounded-2xl bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest text-[11px] transition-all group">
                Checkout{" "}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <p className="mt-6 text-center text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
