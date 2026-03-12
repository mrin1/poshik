"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { 
  Search, Send, Video, Phone, MoreVertical, Paperclip,
  Stethoscope, Store, CheckCheck, Image as ImageIcon, Loader2
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useConversations, useMessages, useSendMessage } from "@/hooks/useChat";

export default function OwnerMessagesPage() {
  const { user } = useAuthStore();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling

  const { data: conversations = [], isLoading: loadingConvs } = useConversations(user?.id);
  const { data: messages = [], isLoading: loadingMessages } = useMessages(activeChatId || undefined);
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (conversations.length > 0 && !activeChatId) {
      setActiveChatId(conversations[0].id);
    }
  }, [conversations, activeChatId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter((c: any) => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);


  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatId || !user?.id) return;

    sendMessage.mutate({
      conversationId: activeChatId,
      senderId: user.id,
      text: messageText.trim()
    });
    
    setMessageText(""); 
  };

  const activeContact = conversations.find((c: any) => c.id === activeChatId);

  if (loadingConvs && conversations.length === 0) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
      <div className="flex h-full">
        
        <div className="w-full md:w-[380px] border-r border-slate-100 flex flex-col bg-slate-50/30">
          <div className="p-8 pb-6">
            <h1 className="text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none mb-6">
              Messages
            </h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                placeholder="Search vets or shops..."
                className="h-12 pl-12 rounded-2xl border-none bg-white shadow-sm font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-8">
              {filteredConversations.length === 0 ? (
                <p className="text-center text-xs font-bold text-slate-400 mt-10 uppercase tracking-widest">No conversations found.</p>
              ) : (
                filteredConversations.map((conv: any) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveChatId(conv.id)}
                    className={`w-full flex items-start gap-4 p-5 rounded-[2rem] transition-all ${
                      activeChatId === conv.id 
                        ? "bg-white shadow-lg shadow-blue-100/50 scale-[1.02] ring-1 ring-blue-50" 
                        : "hover:bg-white/60 text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-slate-950 text-white font-black text-xs">
                          {conv.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {conv.is_online && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-900 uppercase tracking-tight text-xs truncate">{conv.name}</span>
                      
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                           {new Date(conv.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {conv.type === "VET" ? <Stethoscope className="h-3 w-3 text-blue-500" /> : <Store className="h-3 w-3 text-emerald-500" />}
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{conv.type}</span>
                      </div>
                      <p className={`text-[11px] font-bold leading-snug truncate ${conv.unread_count > 0 ? "text-slate-900" : "text-slate-400"}`}>
                        {conv.last_message || "No messages yet"}
                      </p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="bg-orange-600 text-white text-[9px] font-black h-5 w-5 flex items-center justify-center rounded-full shrink-0 shadow-lg shadow-orange-200 mt-1">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>


        {activeContact ? (
          <div className="flex-1 flex flex-col bg-white">
           
            <div className="h-24 flex items-center justify-between px-8 border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 rounded-2xl shadow-sm">
                  <AvatarFallback className="bg-blue-600 text-white font-black">
                    {activeContact.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">{activeContact.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 py-0 h-5 bg-slate-50 border-none text-slate-400">
                      {activeContact.type === "VET" ? "Professional Veterinarian" : "Verified Shop Support"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {activeContact.type === "VET" && (
                  <Button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95">
                    <Video className="h-4 w-4 mr-2" /> Request Call
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600"><Phone className="h-5 w-5" /></Button>
                <Separator orientation="vertical" className="h-8 mx-2" />
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-200"><MoreVertical className="h-5 w-5" /></Button>
              </div>
            </div>

  
            <ScrollArea className="flex-1 p-8 bg-slate-50/30">
              <div className="space-y-6 max-w-4xl mx-auto flex flex-col justify-end min-h-full">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs py-10">Say hello! Start the conversation.</div>
                ) : (
                  messages.map((msg: any) => {
                    
                    const isMe = msg.sender_id === user?.id; 
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[70%] px-6 py-4 rounded-[1.8rem] text-xs font-bold leading-relaxed shadow-sm ${
                          isMe ? "bg-blue-600 text-white rounded-br-none shadow-blue-100" : "bg-white border border-slate-100 text-slate-700 rounded-bl-none"
                        }`}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 px-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          {isMe && <CheckCheck className="h-3 w-3 text-blue-400" />}
                        </div>
                      </div>
                    )
                  })
                )}
              
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

           
            <form onSubmit={handleSend} className="p-8 border-t border-slate-50 bg-white shrink-0">
              <div className="max-w-4xl mx-auto flex items-center gap-4">
                <div className="flex gap-2 hidden sm:flex">
                  <Button type="button" variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600"><Paperclip className="h-5 w-5" /></Button>
                  <Button type="button" variant="ghost" size="icon" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600"><ImageIcon className="h-5 w-5" /></Button>
                </div>
                
                <Input
                  placeholder="Write a message..."
                  className="flex-1 h-14 rounded-2xl border-none bg-slate-50 px-6 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-blue-500"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                
                <Button 
                  type="submit"
                  disabled={sendMessage.isPending || !messageText.trim()}
                  size="icon" 
                  className="h-14 w-14 rounded-2xl bg-slate-900 hover:bg-orange-600 disabled:bg-slate-300 text-white shadow-xl shadow-slate-200 transition-all active:scale-90 shrink-0"
                >
                  {sendMessage.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50/30">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a conversation to start chatting.</p>
          </div>
        )}

      </div>
    </div>
  );
}