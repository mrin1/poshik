"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setLoading, isRegistering } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const isMountedRef = useRef(false);

  const isProtectedRoute = ["/admin", "/owner", "/shop", "/doctor", "/kyc-onboarding"].some((route) =>
    pathname.startsWith(route)
  );

  const getRoleDashboard = (role: string) => {
    const routes: Record<string, string> = {
      ADMIN: "/admin",
      "SUPER-ADMIN": "/admin",
      OWNER: "/owner",
      SHOP: "/shop",
      DOCTOR: "/doctor",
    };
    return routes[role] || "/login";
  };

  const enforcePanelAccess = (role: string) => {
    if (pathname.startsWith("/admin") && role !== "ADMIN" && role !== "SUPER-ADMIN") {
      router.replace(getRoleDashboard(role));
    } else if (pathname.startsWith("/owner") && role !== "OWNER") {
      router.replace(getRoleDashboard(role));
    } else if (pathname.startsWith("/shop") && role !== "SHOP") {
      router.replace(getRoleDashboard(role));
    } else if (pathname.startsWith("/doctor") && role !== "DOCTOR") {
      router.replace(getRoleDashboard(role));
    }
  };

  useEffect(() => {
    setMounted(true);

    const fetchProfile = async (session: any) => {
      if (useAuthStore.getState().isRegistering) return;

      const currentUser = useAuthStore.getState().user;

      if (currentUser && currentUser.id === session.user.id) {
        if (isProtectedRoute) {
          if (currentUser.role === "ADMIN" || currentUser.role === "SUPER-ADMIN") {
            if (pathname === "/kyc-onboarding") router.replace("/admin");
          } else if (currentUser.kyc_status === "NOT_SUBMITTED" && pathname !== "/kyc-onboarding") {
            router.replace("/kyc-onboarding");
          }
          
          enforcePanelAccess(currentUser.role);
        }
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("register")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profile) {
        setUser(profile, session);

        if (isProtectedRoute) {
          if (profile.role === "ADMIN" || profile.role === "SUPER-ADMIN") {
            if (pathname === "/kyc-onboarding") router.replace("/admin");
          } else if (profile.kyc_status === "NOT-SUBMITTED" && pathname !== "/kyc-onboarding") {
            router.replace("/kyc-onboarding");
          }

          enforcePanelAccess(profile.role);
        }
      } else {
        setLoading(false);
      }
    };

    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.user) {
        await fetchProfile(session);
      } else {
        setLoading(false);
        
        if (isProtectedRoute) {
          router.replace("/login");
        }
      }
    };

    if (!isMountedRef.current) {
      checkUser();
      isMountedRef.current = true;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null, null);
          setLoading(false);

          if (isProtectedRoute && event === "SIGNED_OUT") {
            window.location.href = "/login"; 
          }
          return;
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setLoading]); 

  if (!mounted) return null;

  return <>{children}</>;
}