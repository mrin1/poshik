"use client";

import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Link from "next/link";
import {
  PawPrint,
  ShieldCheck,
  UploadCloud,
  Mail,
  Lock,
  User,
  ChevronRight,
  Loader2,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase"; 
import { SignupFormValues } from "@/typescript/types/auth.type";
import { signupSchema } from "@/services/validations/auth.validation";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [activeRole, setActiveRole] = useState<"OWNER" | "DOCTOR" | "SHOP">("OWNER");

  const router = useRouter(); 
  

  const { register, error, setUser } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema) as any,
    defaultValues: {
      role: "OWNER",
      fullName: "",
      email: "",
      password: "",
      kycDocument: null,
    },
  });

  const onSubmit = async (values: yup.InferType<typeof signupSchema>) => {
    setLocalError(null);
    setIsPending(true);
    
    try {
    
      await register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        role: values.role as any,
        kycDocument: values.kycDocument as File | null,
      });

      const isProfessional = values.role === "DOCTOR" || values.role === "SHOP";

    
      if (isProfessional) {
       
        window.location.href = "/kyc-onboarding";
      } else {
       
        await supabase.auth.signOut();
        setUser(null, null);
        const msg = encodeURIComponent("Registration successful! Please log in to access your portal.");
        window.location.href = `/login?message=${msg}`;
      }
      
    } catch (err: any) {
      setLocalError(err.message || "An error occurred during registration.");
      setIsPending(false);
    }
  };

  
  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-4 md:p-8 overflow-hidden relative selection:bg-orange-500 selection:text-white">
      <div className="absolute top-[-10%] left-[-5%] h-[60%] w-[50%] bg-emerald-600/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[60%] w-[50%] bg-emerald-900/10 blur-[140px] rounded-full" />

      <main className="relative z-10 w-full max-w-[480px] bg-[#020617] border border-white/5 rounded-[2.5rem] shadow-2xl p-8 md:p-10 transition-all duration-500 overflow-hidden">
        <div className="mb-8 text-left relative">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <PawPrint className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
            <Link
              href="/login"
              className="text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors pt-2"
            >
              Log In
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase leading-none mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Join the Poshik hub for {activeRole.toLowerCase()}s.
          </p>
        </div>

        {(error || localError) && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-bold text-center animate-in fade-in">
            {localError || error}
          </div>
        )}

        <Tabs
          defaultValue="OWNER"
          onValueChange={(v) => {
            setActiveRole(v as any);
            form.setValue("role" as any, v);
          }}
          className="w-full"
        >
          <TabsList className="mb-8 grid h-14 w-full grid-cols-3 rounded-2xl bg-white/5 p-1.5 border border-white/5">
            <TabsTrigger
              className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all"
              value="OWNER"
            >
              Owner
            </TabsTrigger>
            <TabsTrigger
              className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all"
              value="DOCTOR"
            >
              Doctor
            </TabsTrigger>
            <TabsTrigger
              className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-black transition-all"
              value="SHOP"
            >
              Shop
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      {activeRole === "SHOP" ? "Entity Name" : "Legal Full Name"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          placeholder="Enter name"
                          {...field}
                          className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 font-bold focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500 px-2" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          placeholder="m@example.com"
                          {...field}
                          className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 font-bold focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
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
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-14 pl-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 font-bold focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
                          disabled={isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px] font-bold text-red-500 px-2" />
                  </FormItem>
                )}
              />

              {(activeRole === "DOCTOR" || activeRole === "SHOP") && (
                <FormField
                  control={form.control}
                  name="kycDocument"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">
                        Professional Credentials (KYC)
                      </FormLabel>
                      <FormControl>
                        <div
                          className={`relative group cursor-pointer h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${value ? "border-orange-500 bg-orange-50/10 text-orange-600" : "border-white/5 bg-white/5 text-slate-400 hover:border-orange-500 hover:text-orange-500"}`}
                        >
                          {value ? (
                            <span className="text-[9px] font-black uppercase tracking-widest text-center px-4">
                              {(value as File).name} Attached
                            </span>
                          ) : (
                            <>
                              <UploadCloud className="h-5 w-5" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-center px-4">
                                Upload Certificate
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={isPending}
                            onChange={(e) => onChange(e.target.files?.[0])}
                            {...fieldProps}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="h-14 w-full rounded-2xl bg-orange-600 text-[11px] font-black uppercase tracking-[0.3em] text-white hover:bg-orange-700 transition-all active:scale-[0.98] shadow-lg shadow-orange-900/20 group"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Complete Registration <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </Tabs>

        <div className="mt-10 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 border-t border-white/5 pt-6">
          <ShieldCheck className="h-3 w-3" /> Secure Poshik Hub
        </div>
      </main>
    </div>
  );
}