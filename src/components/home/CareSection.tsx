"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CareSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop"
            className="rounded-[3.5rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
            alt="Dr.Roy - Expert Veterinarian"
          />
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block"
          >
            <Badge className="bg-emerald-500 mb-1">Live Consultation</Badge>
            <p className="font-black text-slate-900 text-xl uppercase tracking-tighter">
              Dr.Roy
            </p>
          </motion.div>
        </motion.div>

        <div className="space-y-8">
          <h2 className="text-5xl font-[900] text-slate-900 tracking-tighter uppercase leading-[1]">
            EXPERT CARE. <br /> INSTANT ACCESS.
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Online Video",
              "Clinic Visit",
              "E-Prescription",
              "Medical Vault",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
              >
                <Check className="h-4 w-4 text-orange-500" /> {t}
              </div>
            ))}
          </div>
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 h-16 px-12 rounded-2xl font-black uppercase text-xs shadow-xl shadow-blue-100"
          >
            <Link href="/vets">Book Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
