"use client";
import { MoreHorizontal, FileText, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentActionsProps } from "@/typescript/interface/appointments";



export const AppointmentActions = ({ id, status, onUpdateStatus }: AppointmentActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
          <MoreHorizontal className="h-5 w-5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Actions</DropdownMenuLabel>
        <DropdownMenuItem className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 focus:bg-slate-50"><FileText className="mr-3 h-4 w-4" /> Medical History</DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 focus:bg-slate-50"><MessageSquare className="mr-3 h-4 w-4" /> Message Owner</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-50" />
        {status === "PENDING" && (
          <DropdownMenuItem onClick={() => onUpdateStatus(id, "CONFIRMED")} className="text-emerald-600 font-black text-[10px] uppercase px-4 py-3 cursor-pointer focus:bg-emerald-50"><CheckCircle className="mr-3 h-4 w-4" /> Accept</DropdownMenuItem>
        )}
        {status === "CONFIRMED" && (
          <DropdownMenuItem onClick={() => onUpdateStatus(id, "COMPLETED")} className="text-emerald-600 font-black text-[10px] uppercase px-4 py-3 cursor-pointer focus:bg-emerald-50"><CheckCircle className="mr-3 h-4 w-4" /> Complete</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};