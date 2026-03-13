import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";

export function useVets(searchTerm: string = "") {
  return useQuery({
    queryKey: ["doctors", searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("register")
        .select("*")
        // .eq("role", "DOCTOR")
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("name", `%${searchTerm}%`);
      }

      const { data, error } = await query;
      console.log("ALL USERS:", data);

      if (error) throw error;
      return data || [];
    },
  });
}
