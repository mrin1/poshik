import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    CONFIRMED: "bg-blue-50 text-blue-600",
    PENDING: "bg-amber-50 text-amber-600",
    COMPLETED: "bg-emerald-50 text-emerald-600",
    CANCELLED: "bg-slate-50 text-slate-400",
  };

  return (
    <Badge className={`${styles[status] || "bg-slate-50 text-slate-500"} border-none font-black text-[9px] uppercase tracking-widest px-3 py-1`}>
      {status === "PENDING" ? "Awaiting" : status}
    </Badge>
  );
};