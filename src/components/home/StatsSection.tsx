"use client";
import { motion } from "framer-motion";

export default function StatsSection({ stats }: { stats: any }) {
  const items = [
    { val: stats?.pets || "12k", label: "Active Pets" },
    { val: stats?.vets || "450", label: "Verified Vets" },
    { val: stats?.shops || "200", label: "Local Shops" },
    { val: stats?.owners || "15k", label: "Pet Parents" },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2"
          >
            <p className="text-5xl font-[900] text-slate-900 tracking-tighter">
              {item.val}+
            </p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
