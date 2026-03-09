"use client";

import { Card } from "@/components/ui/card";

export function InventoryStats({ inventory }: { inventory: any[] | undefined }) {
  const totalItems = inventory?.length || 0;
  const lowStock = inventory?.filter(p => p.stock > 0 && p.stock <= 5).length || 0;
  const outOfStock = inventory?.filter(p => p.stock === 0).length || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatBox label="Total SKUs" val={totalItems} color="emerald" />
      <StatBox label="Low Stock" val={lowStock} color="orange" />
      <StatBox label="Out of Stock" val={outOfStock} color="red" />
    </div>
  );
}

function StatBox({ label, val, color }: { label: string, val: number, color: string }) {
  const colors: Record<string, string> = { 
    emerald: "text-emerald-700", 
    orange: "text-orange-700", 
    red: "text-red-700" 
  };
  
  return (
    <Card className="p-6 rounded-[2rem] border-2 border-white shadow-lg shadow-slate-200/40 bg-white flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <span className={`text-3xl font-[900] tracking-tighter ${colors[color]}`}>{val}</span>
    </Card>
  );
}