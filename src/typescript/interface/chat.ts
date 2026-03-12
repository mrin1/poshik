import { Conversation } from "@/hooks/useChat";

export interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}
