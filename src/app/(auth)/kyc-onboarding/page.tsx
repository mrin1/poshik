"use client";

import { useState, useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { supabase } from "@/utils/supabase";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ShieldAlert,
  UploadCloud,
  CheckCircle2,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { OnboardingFormValues } from "@/typescript/types/auth.type";
import { onboardingSchema } from "@/services/validations/auth.validation";

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(33);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role === "ADMIN" || user.role === "SUPER-ADMIN") {
        router.push("/admin");
        return;
      }
      if (user.role === "OWNER") {
        router.push("/owner");
        return;
      }

      if (user.kyc_status === "PENDING" || user.kyc_status === "APPROVED") {
        const target = user.role === "DOCTOR" ? "/doctor" : "/shop";
        router.push(target);
      }
    }
  }, [user, router, mounted]);

  const form = useForm<OnboardingFormValues>({
    resolver: yupResolver(onboardingSchema) as any,
    defaultValues: {
      phoneNumber: "",
      address: "",
      experience: undefined,
      kycDocument: undefined,
    },
  });

  const nextStep = () => {
    setStep((prev) => (prev + 1) as 1 | 2 | 3);
    setProgress((prev) => prev + 33);
  };

  const prevStep = () => {
    setStep((prev) => (prev - 1) as 1 | 2 | 3);
    setProgress((prev) => prev - 33);
  };

  async function onSubmit(values: OnboardingFormValues) {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const file = values.kycDocument as File;
      const fileName = `${user.id}/${Date.now()}.${file.name.split(".").pop()}`;

      const { error: uploadError } = await supabase.storage
        .from("kyc-docs")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("kyc-docs")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("register")
        .update({
          kyc_document_url: publicUrlData.publicUrl,
          kyc_status: "PENDING",
          phone: values.phoneNumber,
          address: values.address,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      await supabase.auth.signOut();
      setUser(null, null);

      nextStep();
    } catch (error: any) {
      console.error("Verification Hub Error:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleExitToLogin = () => {
    const msg = encodeURIComponent(
      "Verification submitted securely. Please wait for admin approval before logging in.",
    );
    window.location.href = `/login?message=${msg}`;
  };

  if (!mounted || !user) return null;

  if (
    user.role === "ADMIN" ||
    user.role === "SUPER-ADMIN" ||
    user.role === "OWNER"
  )
    return null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 py-12">
      <Card className="w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border-slate-200 rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="text-center pt-10">
          <CardTitle className="text-3xl font-black uppercase tracking-tighter text-slate-950">
            Node Verification
          </CardTitle>
          <CardDescription className="font-bold text-blue-600 uppercase text-[10px] tracking-[0.2em] mt-1">
            {user.role === "DOCTOR"
              ? "Veterinary Medical License"
              : "Retail Entity Certification"}
          </CardDescription>
          <div className="mt-8 px-10">
            <Progress value={progress} className="w-full h-1.5 bg-slate-100" />
          </div>
        </CardHeader>

        <CardContent className="mt-4 p-10 pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                      Phase 01
                    </h3>
                    <p className="text-lg font-bold text-slate-900 leading-none">
                      Operational Intel
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Contact Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+91 00000 00000"
                              className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-blue-600 transition-all shadow-sm"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold text-red-500" />
                        </FormItem>
                      )}
                    />
                    {user.role === "DOCTOR" && (
                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                              Clinical Experience
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Total Years"
                                className="h-14 rounded-2xl border-slate-200 font-bold shadow-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold text-red-500" />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          Practice / Shop HQ Address
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter full operational details..."
                            className="min-h-[120px] rounded-2xl border-slate-200 font-bold p-4 resize-none shadow-sm focus:ring-blue-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-red-500" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-6">
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="h-14 px-10 rounded-2xl bg-slate-950 font-black uppercase tracking-widest text-[10px] text-white hover:bg-slate-800 transition-all shadow-xl"
                    >
                      Save & Proceed <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">
                      Phase 02
                    </h3>
                    <p className="text-lg font-bold text-slate-900 leading-none">
                      Security Submission
                    </p>
                  </div>

                  <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex items-start space-x-4 shadow-sm">
                    <ShieldAlert className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                      Manual verification is required for all{" "}
                      {user.role.toLowerCase()} accounts in the Kolkata Node to
                      maintain network integrity.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="kycDocument"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormControl>
                          <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center hover:bg-blue-50/20 hover:border-blue-500 transition-all cursor-pointer relative group bg-slate-50/30 shadow-inner">
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              {...fieldProps}
                            />
                            <div className="space-y-5">
                              <div className="bg-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-500">
                                <UploadCloud className="h-10 w-10 text-slate-300 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="px-6">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-900">
                                  Upload Professional Credentials
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                                  Trade License or Medical Permit (Max 10MB)
                                </p>
                              </div>
                              {value && (
                                <div className="mt-8 inline-flex items-center px-5 py-2.5 bg-emerald-600 rounded-full text-[9px] text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-200 animate-in zoom-in">
                                  <CheckCircle2 className="mr-2 h-3 w-3" />
                                  Attached: {(value as File).name}
                                </div>
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold text-red-500" />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      className="font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-widest text-[10px] text-white shadow-2xl shadow-blue-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Authorize Submission"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12 animate-in zoom-in-95 duration-700">
                  <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner">
                    <CheckCircle2
                      className="h-12 w-12 text-emerald-600"
                      strokeWidth={3}
                    />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-950 mb-4 leading-none">
                    Access Locked
                  </h2>
                  <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto mb-12 leading-relaxed">
                    Account successfully flagged for review. You have been
                    securely signed out to finalize the process.
                  </p>

                  <Button
                    type="button"
                    onClick={handleExitToLogin}
                    className="h-16 w-full rounded-2xl bg-slate-950 font-black uppercase tracking-[0.3em] text-[11px] text-white shadow-2xl hover:bg-slate-800 transition-colors"
                  >
                    Back to Portal Login
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
