"use client";

import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  PawPrint,
  ShieldCheck,
  Lock,
  Mail,
  ChevronRight,
  Globe,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase"; // Imported for safe session termination
import { loginSchema } from "@/services/validations/auth.validation";
import * as yup from "yup";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Extract universal auth state
  const { login, user, setUser } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // --- HYDRATION GUARD & URL PARAM EXTRACTION ---
  useEffect(() => {
    setMounted(true);
    // Safely extract URL parameters entirely on the client side
    // This prevents Next.js hydration mismatches and avoids needing <Suspense>
    const params = new URLSearchParams(window.location.search);
    const message = params.get("message");
    if (message) setSuccessMsg(message);
  }, []);

  //--- RECTIFIED UNIVERSAL LOGIN REDIRECT ---
  useEffect(() => {
    if (mounted && user) {
      // 1. HIGH PRIORITY: Administrative Bypass
      if (user.role === "ADMIN" || user.role === "SUPER-ADMIN") {
        router.push("/admin");
        return;
      }

      //2. ROLE BYPASS: Pet Owners (Bypass KYC)
      if (user.role === "OWNER") {
        router.push("/owner");
        return;
      }

      // 3. PROFESSIONAL FUNNEL: Doctors & Shops
      if (user.role === "DOCTOR" || user.role === "SHOP" || user.role==="OWNER") {

        // A. If documents are missing, force onboarding
        if (user.kyc_status === "NOT_SUBMITTED") {
          router.push("/kyc-onboarding");
        }

        // B. If submitted but pending admin review
        else if (user.kyc_status === "PENDING") {
          setLocalError("Your professional documents are currently under review by the Kolkata Node.");

          // SECURITY FIX: Terminate the "ghost session" immediately so they
          // don't remain logged in while locked out of the dashboard.
          supabase.auth.signOut().then(() => {
            setUser(null, null);
          });
        }

        // C. If approved, route to professional dashboards
        else if (user.kyc_status === "APPROVED") {
          const targetRoute = user.role === "DOCTOR" ? "/doctor" : "/shop";
          router.push(targetRoute);
        }
      }
    }
  }, [user, router, mounted, setUser]);

  // useEffect(() => {
  //   if (mounted && user) {
  //     // 1. HIGH PRIORITY: Administrative Bypass [cite: 18, 103]
  //     if (user.role === "ADMIN" || user.role === "SUPER-ADMIN") {
  //       router.push("/admin");
  //       return;
  //     }

  //     // 2. RECTIFIED FUNNEL: Owners, Doctors & Shops [cite: 35, 44]
  //     // Including "OWNER" here ensures they are no longer bypassed.
  //     if (
  //       user.role === "DOCTOR" ||
  //       user.role === "SHOP" ||
  //       user.role === "OWNER"
  //     ) {
  //       // A. If documents are missing, force onboarding [cite: 36, 41]
  //       if (user.kyc_status === "NOT_SUBMITTED") {
  //         router.push("/kyc-onboarding");
  //         return; // Added return to prevent further execution
  //       }

  //       // B. If submitted but pending admin review [cite: 37, 100]
  //       else if (user.kyc_status === "PENDING") {
  //         setLocalError(
  //           "Your verification documents are currently under review by the Kolkata Node.",
  //         );

  //         // SECURITY FIX: Terminate session for all unapproved roles [cite: 38]
  //         supabase.auth.signOut().then(() => {
  //           setUser(null, null);
  //         });
  //         return;
  //       }

  //       // C. RECTIFIED: If approved, route to specific dashboards [cite: 38, 44]
  //       else if (user.kyc_status === "APPROVED") {
  //         let targetRoute = "/owner"; // Default fallback

  //         if (user.role === "DOCTOR") targetRoute = "/doctor";
  //         else if (user.role === "SHOP") targetRoute = "/shop";
  //         else if (user.role === "OWNER") targetRoute = "/owner"; // Explicitly set for owner

  //         router.push(targetRoute);
  //       }
  //     }
  //   }
  // }, [user, router, mounted, setUser]);

  const form = useForm({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: yup.InferType<typeof loginSchema>) => {
    setLocalError(null);
    setSuccessMsg(null); // Clear success message on new attempt
    setIsPending(true);
    try {
      await login({ email: values.email, password: values.password });
    } catch (err: any) {
      setLocalError(err.message || "Invalid credentials. Please try again.");
      setIsPending(false);
    }
  };

  // Prevent flicker during client hydration
  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-4 md:p-8 overflow-hidden relative selection:bg-emerald-500 selection:text-white">
      <div className="absolute top-[-10%] left-[-5%] h-[60%] w-[50%] bg-emerald-600/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[60%] w-[50%] bg-emerald-900/10 blur-[140px] rounded-full" />

      <main className="relative z-10 w-full max-w-[480px] bg-[#020617] border border-white/5 rounded-[2.5rem] shadow-2xl p-8 md:p-10 transition-all duration-500 overflow-hidden">
        {/* SUCCESS NOTIFICATION BAR */}
        {successMsg && !localError && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 leading-tight">
              {successMsg}
            </p>
          </div>
        )}

        <div className="mb-10 text-left relative">
          <div className="flex justify-between items-start mb-8">
            <div className="h-14 w-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <PawPrint className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <Link
              href="/register"
              className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors pt-2"
            >
              Sign Up
            </Link>
          </div>
          <h1 className="text-3xl font-[900] tracking-tighter text-white uppercase leading-none mb-3">
            Identify Account
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Enter your credentials to access the hub.
          </p>
        </div>

        {/* Global Error Alerts */}
        {localError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <p className="text-[11px] font-bold text-red-500 text-center w-full leading-tight">
              {localError}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left">
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Universal ID
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        placeholder="m@example.com"
                        {...field}
                        className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-700 font-bold focus-visible:ring-2 focus-visible:ring-orange-500 transition-all shadow-sm"
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-red-500 px-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left">
                  <div className="flex items-center justify-between ml-1">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Security Key
                    </FormLabel>
                    <Link
                      href="#"
                      className="text-[10px] font-black text-slate-500 hover:text-orange-500 transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-700 font-bold focus-visible:ring-2 focus-visible:ring-orange-500 transition-all shadow-sm"
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] font-bold text-red-500 px-2" />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                className="h-14 w-full rounded-2xl bg-orange-600 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-orange-700 transition-all active:scale-[0.98] shadow-lg shadow-orange-900/20 group"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Authenticating...
                  </>
                ) : (
                  <>
                    Authorize Access{" "}
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-10 flex items-center justify-between gap-2 border-t border-white/5 pt-6">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <Globe className="h-3 w-3 text-orange-500" /> Kolkata Node
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
            <ShieldCheck className="h-3 w-3" /> Secure Access
          </div>
        </div>
      </main>
    </div>
  );
}
