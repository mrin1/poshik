"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Paperclip,
  CheckCheck,
  Package,
  User,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  ChevronRight,
  ShieldCheck,
  Activity
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const shopConversations = [
  { id: "c-101", name: "Mrinmoy Ghosh", lastMessage: "Is the Golden Retriever food back in stock?", time: "10:30 AM", unread: 2, orderId: "ORD-5542", avatar: "" },
  { id: "c-102", name: "Aditi Rao", lastMessage: "Thank you for the fast delivery!", time: "Yesterday", unread: 0, orderId: "ORD-5510", avatar: "" },
];

const mockChatHistory = [
  { id: "m-1", sender: "customer", text: "Hello, I ordered a heavy-duty leash yesterday.", time: "09:00 AM" },
  { id: "m-2", sender: "shop", text: "Hi! Let me check that for you. Can I have your order ID?", time: "09:15 AM" },
  { id: "m-3", sender: "customer", text: "It's ORD-5542. Also, is the Golden Retriever food back in stock?", time: "10:30 AM" },
];

export default function ShopMessagesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeId, setActiveId] = useState("c-101");
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    setMounted(true);
  }, []);

  const activeChat = shopConversations.find(c => c.id === activeId) || shopConversations[0];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
      <div className="flex h-full">
        
        <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-8 pb-6">
            <h1 className="text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none mb-6">
              Support <br /> Queue
            </h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <Input
                placeholder="Search customers or orders..."
                className="h-12 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-8">
              {shopConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`w-full flex items-start gap-4 p-5 rounded-[2rem] transition-all ${
                    activeId === conv.id 
                      ? "bg-white shadow-lg shadow-emerald-100/50 scale-[1.02] ring-1 ring-emerald-50" 
                      : "hover:bg-white/60 text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-slate-900 text-white font-[900] text-xs">
                      {conv.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-slate-900 uppercase tracking-tight text-xs truncate">{conv.name}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{conv.time}</span>
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 truncate flex items-center gap-1">
                      <Package size={10} /> {conv.orderId}
                    </div>
                    <p className={`text-[11px] font-bold leading-snug truncate ${conv.unread > 0 ? "text-slate-900" : "text-slate-400"}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="bg-orange-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full shrink-0 shadow-lg shadow-orange-200 mt-1">
                      {conv.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-white">
        
          <div className="h-24 flex items-center justify-between px-8 border-b border-slate-50">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-2xl shadow-sm">
                <AvatarFallback className="bg-emerald-600 text-white font-black">
                  {activeChat.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">{activeChat.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Live Now
                  </div>
                  <Separator orientation="vertical" className="h-2" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">ID: {activeChat.id}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-12 px-6 rounded-2xl border-2 border-emerald-50 text-emerald-600 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-50 transition-all">
                <Package className="h-4 w-4 mr-2" />
                Track Order
              </Button>
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-200">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

       
          <ScrollArea className="flex-1 p-8 bg-slate-50/30">
            <div className="space-y-6 max-w-4xl mx-auto">
              {mockChatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === "shop" ? "items-end" : "items-start"}`}
                >
                  <div 
                    className={`max-w-[70%] px-6 py-4 rounded-[1.8rem] text-xs font-bold leading-relaxed shadow-sm ${
                      msg.sender === "shop" 
                        ? "bg-emerald-600 text-white rounded-br-none shadow-emerald-100" 
                        : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 px-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{msg.time}</span>
                    {msg.sender === "shop" && <CheckCheck className="h-3 w-3 text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

      
          <div className="p-8 border-t border-slate-50 bg-white">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-600">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-emerald-600">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <Input
                placeholder="Type a support reply..."
                className="flex-1 h-14 rounded-2xl border-none bg-slate-50 px-6 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-emerald-500"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              
              <Button 
                size="icon" 
                className="h-14 w-14 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white shadow-xl shadow-slate-200 transition-all active:scale-90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        
        <div className="hidden xl:flex w-[300px] border-l border-slate-50 p-8 flex-col gap-8 bg-white">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">Customer Profile</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{activeChat.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Package size={20} />
                  </div>
                  <span className="text-xs font-black text-slate-900 uppercase tracking-tight">12 Orders Total</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Activity size={20} />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase tracking-widest px-3">Top Tier</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-50" />

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Quick Links</h4>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-between font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-600 px-0 group">
                  Refund Policy <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
                <Button variant="ghost" className="w-full justify-between font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-emerald-600 px-0 group">
                  Inventory Sync <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>

            <div className="mt-auto p-6 bg-slate-950 rounded-[2rem] text-white relative overflow-hidden group">
               <ShieldCheck className="absolute -right-4 -bottom-4 h-20 w-20 text-white/10" />
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Verified Support</p>
               <p className="text-xs font-medium leading-relaxed text-slate-400">Messages are monitored for quality control.</p>
            </div>
        </div>

      </div>
    </div>
  );
}