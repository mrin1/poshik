import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase";

export interface Conversation {
  id: string;
  ownerName: string;
  petName: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export function useChat(doctorId: string | undefined) {
  const queryClient = useQueryClient();

  const inboxes = useQuery({
    queryKey: ["conversations", doctorId],
    queryFn: async (): Promise<Conversation[]> => {
      if (!doctorId) return [];
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          id, updated_at,
          owner:register!owner_id ( full_name ),
          pets ( name ),
          messages ( text, created_at, is_read, sender_id )
        `,
        )
        .eq("doctor_id", doctorId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((conv: any) => {
        const sorted = conv.messages?.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        const lastMsg = sorted?.[0];
        const unread =
          conv.messages?.filter(
            (m: any) => !m.is_read && m.sender_id !== doctorId,
          ).length || 0;

        return {
          id: conv.id,
          ownerName: conv.owner?.full_name || "Unknown Owner",
          petName: conv.pets?.name || "General Consult",
          lastMessage: lastMsg?.text || "No messages yet.",
          time: lastMsg
            ? new Date(lastMsg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
          unread,
        };
      });
    },
    enabled: !!doctorId,
  });

  useEffect(() => {
    if (!doctorId) return;

    const channel = supabase
      .channel("global_inbox_updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["conversations", doctorId],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doctorId, queryClient]);

  return { inboxes };
}
