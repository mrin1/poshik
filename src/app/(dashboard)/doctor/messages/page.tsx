"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { supabase } from "@/utils/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { ChatSidebar } from "@/components/chat/ChatSidebar";

import { useConversations, useMessages, useSendMessage } from "@/hooks/useChat";

export default function DoctorMessagesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [mounted, setMounted] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: conversations = [], isLoading: loadingConvs } =
    useConversations(user?.id);
  const { data: messages = [], isLoading: loadingMessages } = useMessages(
    activeChatId || undefined,
  );
  const sendMessage = useSendMessage();

  useEffect(() => {
    if (!activeChatId) return;

    const channel = supabase
      .channel(`active_chat_${activeChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeChatId}`,
        },
        (payload) => {
          if (payload.new.sender_id !== user?.id) {
            queryClient.setQueryData(
              ["messages", activeChatId],
              (oldMessages: any) => {
                return [...(oldMessages || []), payload.new];
              },
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeChatId, user?.id, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChatId || !user?.id) return;

    sendMessage.mutate({
      conversationId: activeChatId,
      senderId: user.id,
      text: messageInput.trim(),
    });

    setMessageInput("");
  };

  const activeContact = conversations.find((c) => c.id === activeChatId);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
      <div className="flex h-full">
        <ChatSidebar
          conversations={conversations}
          activeId={activeChatId}
          onSelect={setActiveChatId}
          isLoading={loadingConvs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="flex-1 flex flex-col bg-white">
          {activeContact ? (
            <>
              <div className="h-24 flex items-center justify-between px-8 border-b border-slate-50 shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 rounded-2xl">
                    <AvatarFallback className="bg-slate-900 text-white font-black">
                      {activeContact.ownerName?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-black text-slate-900 uppercase text-sm">
                      {activeContact.ownerName}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                      Consulting for:{" "}
                      <span className="text-blue-600">
                        {activeContact.petName}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 hover:text-blue-600"
                  >
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">
                    <Video className="h-4 w-4 mr-2" />
                    Remote Consult
                  </Button>
                  <Separator orientation="vertical" className="h-8 mx-2" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-2xl text-slate-300"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-8 bg-slate-50/30">
                <div className="space-y-6 max-w-4xl mx-auto flex flex-col justify-end min-h-full">
                  {loadingMessages ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs py-10">
                      Start the medical consultation.
                    </div>
                  ) : (
                    messages.map((msg: any) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-6 py-4 rounded-[1.8rem] text-xs font-bold shadow-sm ${
                              isMe
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-white border text-slate-700 rounded-bl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1.5 mt-2 px-2">
                            <span className="text-[9px] font-black text-slate-300 uppercase">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMe && (
                              <CheckCheck className="h-3 w-3 text-blue-400" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-slate-50 bg-white shrink-0">
                <form
                  onSubmit={handleSendMessage}
                  className="max-w-4xl mx-auto flex items-center gap-4"
                >
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 bg-slate-50"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-14 w-14 bg-slate-50"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Issue medical advice..."
                    className="flex-1 h-14 rounded-2xl border-none bg-slate-50 px-6 font-bold"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    disabled={sendMessage.isPending || !messageInput.trim()}
                    size="icon"
                    className="h-14 w-14 rounded-2xl bg-slate-900 text-white shadow-xl active:scale-90 transition-all disabled:opacity-50 disabled:active:scale-100"
                  >
                    {sendMessage.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50/30">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
                Select a conversation to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
