"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Heart, Stethoscope } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "Verified KYC", desc: "Document-backed security for all users." },
  { icon: Heart, title: "Health Track", desc: "Integrated medical and vaccination records." },
  { icon: Stethoscope, title: "Expert Vets", desc: "Certified doctors and online consultations." },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
        {FEATURES.map((f, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 group text-center md:text-left"
          >
            <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
              <f.icon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">{f.title}</h3>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}