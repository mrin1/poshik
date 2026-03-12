"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";


export interface Conversation {
  id: string;
  ownerName: string;
  petName: string;
  time: string;
  lastMessage: string;
  unread: number;
}

export function useConversations(userId: string | undefined) {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
}

export function useMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true }); 

      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId,
    refetchInterval: 3000, 
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, senderId, text }: { conversationId: string, senderId: string, text: string }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert([{ conversation_id: conversationId, sender_id: senderId, text }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newMessage) => {
    
      queryClient.setQueryData(["messages", newMessage.conversation_id], (oldMessages: any) => {
        return [...(oldMessages || []), newMessage];
      });
      
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
}