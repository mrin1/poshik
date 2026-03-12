"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-orange-50 rounded-bl-[10rem] hidden lg:block" />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Sparkles className="h-4 w-4 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Verified Community
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-[900] text-slate-900 leading-[0.85] tracking-tighter uppercase">
            Connect. <br /> Care. <br />{" "}
            <span className="text-orange-600">Celebrate.</span>
          </h1>
          <div className="flex gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 rounded-2xl h-16 px-10 font-black uppercase shadow-xl shadow-orange-200"
            >
              <Link href="/map">Explore Pet Map</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-200 rounded-2xl h-16 px-10 font-black uppercase bg-white"
            >
              <Link href="/vets">Find a Doctor</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative group"
        >
          <div className="bg-slate-900 aspect-square rounded-[3.5rem] p-3 shadow-3xl overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop"
              className="w-full h-full object-cover rounded-[3rem] opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              alt="Pet Digital Health System"
            />
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-600 p-8 rounded-full shadow-2xl"
            >
              <MapPin className="h-10 w-10 text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
