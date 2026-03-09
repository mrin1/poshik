import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CartItem({ item, onUpdate, onRemove }: any) {
  return (
    <div className="group flex items-center gap-6 p-6 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all border border-slate-100">
      <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center font-black text-slate-200">
        📦
      </div>
      
      <div className="flex-1">
        <h3 className="font-[900] uppercase text-slate-900 tracking-tighter leading-tight">{item.name}</h3>
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.category}</p>
        <div className="mt-2 text-lg font-[900]">₹{item.price.toLocaleString("en-IN")}</div>
      </div>

      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
        <Button 
          variant="ghost" size="icon" className="h-8 w-8 rounded-xl"
          onClick={() => onUpdate(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
        <Button 
          variant="ghost" size="icon" className="h-8 w-8 rounded-xl"
          onClick={() => onUpdate(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        variant="ghost" size="icon" 
        className="text-slate-300 hover:text-red-500 transition-colors"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}