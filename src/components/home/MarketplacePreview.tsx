"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATS = ["Nutrition", "Wellness", "Leashes", "Comfort"];

export default function MarketplacePreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-[900] text-slate-900 uppercase tracking-tighter">Premium Marketplace</h2>
          <Button asChild variant="link" className="text-orange-600 font-black uppercase text-xs group">
            <Link href="/marketplace" className="flex items-center">
              Browse Shop <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {CATS.map((cat) => (
            <motion.div whileHover={{ y: -10 }} key={cat}>
              <Link href={`/marketplace?category=${cat}`} className="block group bg-slate-50 border-2 border-transparent hover:border-orange-500 hover:bg-white rounded-[3rem] p-12 text-center transition-all duration-500 shadow-sm">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ShoppingBag className="h-7 w-7 text-slate-300 group-hover:text-orange-600 transition-colors" />
                </div>
                <span className="font-black text-slate-900 uppercase text-[11px] tracking-widest">{cat}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}