"use client";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation } from "@/hooks/useChat";
import { SidebarProps } from "@/typescript/interface/chat";


export function ChatSidebar({ conversations, activeId, onSelect, isLoading, searchQuery, setSearchQuery }: SidebarProps) {
  const filtered = conversations.filter(c => 
    c.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.petName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30 h-full">
      <div className="p-8 pb-6">
        <h1 className="text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none mb-6">Inboxes</h1>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            placeholder="Search owners or pets..."
            className="h-12 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
        ) : (
          <div className="space-y-2 pb-8">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`w-full flex items-start gap-4 p-5 rounded-[2rem] transition-all ${
                  activeId === conv.id ? "bg-white shadow-lg shadow-blue-100/50 scale-[1.02] ring-1 ring-blue-50" : "hover:bg-white/60"
                }`}
              >
                <Avatar className="h-12 w-12 rounded-2xl border-2 border-white">
                  <AvatarFallback className="bg-blue-600 text-white font-black text-xs">{conv.ownerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-slate-900 uppercase text-xs truncate mr-2">{conv.ownerName}</span>
                    <span className="text-[9px] font-black uppercase text-slate-400 shrink-0">{conv.time}</span>
                  </div>
                  <div className="text-[10px] font-black text-blue-600 uppercase truncate">{conv.petName}</div>
                  <p className={`text-[11px] font-bold truncate ${conv.unread > 0 ? "text-slate-900" : "text-slate-400"}`}>{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && <span className="bg-orange-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full shrink-0">{conv.unread}</span>}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}