import { create } from "zustand";
import { supabase } from "@/utils/supabase";
import { AuthState, UserProfile } from "@/typescript/interface/auth";
import { toast } from "sonner";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isRegistering: false,
  error: null,

  setUser: (user, session) => set({ user, session, isLoading: false }),
  setLoading: (status) => set({ isLoading: status }),

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Login successfully");

      const { data: profileData, error: profileError } = await supabase
        .from("register")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profileData)
        throw new Error("Profile not found. Please register again.");

      set({ user: profileData, session: data.session, isLoading: false });
      return profileData;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async ({ email, password, fullName, role, kycDocument }) => {
    set({ isLoading: true, isRegistering: true, error: null });
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to generate user ID.");

      const superAdminEmail = "mrinmoyghosh.ko8@gmail.com";

      const baseProfile = {
        id: userId,
        email,
        full_name: fullName,
        role: email === superAdminEmail ? "SUPER-ADMIN" : role,

        kyc_status: email === superAdminEmail ? "APPROVED" : "NOT_SUBMITTED",
        kyc_document_url: null,
      };

      const { error: dbError } = await supabase
        .from("register")
        .upsert(baseProfile, { onConflict: "id" });

      if (dbError) {
        console.error("Database Insert Error:", dbError);
        throw new Error("Could not create profile record. Check RLS policies.");
      }

      let finalKycStatus = baseProfile.kyc_status;

      if (kycDocument) {
        const fileExt = kycDocument.name.split(".").pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("kyc-docs")
          .upload(fileName, kycDocument);

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("kyc-docs")
            .getPublicUrl(fileName);

          await supabase
            .from("register")
            .update({
              kyc_document_url: publicUrlData.publicUrl,
              kyc_status: "PENDING",
            })
            .eq("id", userId);

          finalKycStatus = "PENDING";
        }
      }

      set({
        user: { ...baseProfile, kyc_status: finalKycStatus } as UserProfile,
        session: authData.session,
        isLoading: false,
        isRegistering: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, isRegistering: false });
      throw error;
    }
  },

  logout: async () => {
    set({ user: null, session: null, isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      window.location.href = "/";

      toast.success("Logout successfully");
    } catch (error: any) {
      //console.error("Logout error:", error.message);

      toast.error("Error");

      window.location.href = "/";
    } finally {
      set({ isLoading: false });
    }
  },
}));
