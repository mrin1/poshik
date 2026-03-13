"use client";

import { useAuthStore } from "@/zustand/store/useAuthStore";
import { LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const LogoutButton = () => {
  const [mounted, setMounted] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => logout()}
      disabled={isLoading}
      className="flex items-center w-full px-5 py-4 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group font-bold disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="mr-4 h-5 w-5 animate-spin" />
      ) : (
        <LogOut
          className="mr-4 h-5 w-5 group-hover:-translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      )}

      <span className="text-xs font-black uppercase tracking-widest">
        {isLoading ? "Processing..." : "Sign Out"}
      </span>
    </button>
  );
};
