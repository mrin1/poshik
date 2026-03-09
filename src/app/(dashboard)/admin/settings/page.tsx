"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Bell,
  CreditCard,
  Globe,
  Save,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Updated",
        description:
          "Global platform configurations have been saved successfully.",
      });
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Global <br /> Settings
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-sm">
            Configure platform-wide protocols and system preferences.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="h-14 px-8 bg-slate-950 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-70"
        >
          {isSaving ? (
            <span className="flex items-center gap-2 italic">
              Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" /> Save All Changes
            </span>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="h-16 inline-flex bg-slate-100 rounded-[1.5rem] p-1.5 mb-10 overflow-x-auto">
          <TabsTrigger
            value="general"
            className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600"
          >
            Fees
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600"
          >
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="general"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SettingsCard
              icon={<Globe className="text-blue-500" />}
              title="Platform Identity"
              description="Basic information visible to all users."
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Platform Name
                  </Label>
                  <Input
                    defaultValue="Poshik Pet Social"
                    className="h-14 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Support Email
                  </Label>
                  <Input
                    defaultValue="support@poshik.com"
                    className="h-14 rounded-xl border-none bg-slate-50 font-bold focus-visible:ring-2 focus-visible:ring-orange-500"
                  />
                </div>
              </div>
            </SettingsCard>

            <SettingsCard
              icon={<ShieldCheck className="text-emerald-500" />}
              title="Onboarding Controls"
              description="Manage how new accounts join the ecosystem."
            >
              <div className="space-y-4">
                <ToggleItem
                  label="Doctor Registration"
                  sub="Allow new vets to create profiles"
                />
                <ToggleItem
                  label="Shop Registration"
                  sub="Allow new pet shops to list products"
                />
              </div>
            </SettingsCard>
          </div>
        </TabsContent>

        <TabsContent
          value="security"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
        >
          <SettingsCard
            icon={<Lock className="text-red-500" />}
            title="Authentication Policy"
            description="Secure the platform with advanced protocols."
            className="max-w-3xl"
          >
            <div className="space-y-6">
              <ToggleItem
                label="Require 2FA for Admins"
                sub="Add an extra security layer for staff"
              />
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Session Timeout
                  </Label>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    Automatic logout after inactivity
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    defaultValue="60"
                    className="h-12 w-24 rounded-xl border-none bg-slate-50 font-black text-center"
                  />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Min
                  </span>
                </div>
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent
          value="billing"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
        >
          <SettingsCard
            icon={<CreditCard className="text-purple-500" />}
            title="Platform Commission"
            description="Set the percentage Poshik takes from transactions."
            className="max-w-3xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Shop Sales Fee
                </Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    type="number"
                    defaultValue="5"
                    className="h-14 rounded-xl border-none bg-white font-black text-xl"
                  />
                  <span className="text-xl font-black text-slate-300">%</span>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Doctor Consult Fee
                </Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    type="number"
                    defaultValue="10"
                    className="h-14 rounded-xl border-none bg-white font-black text-xl"
                  />
                  <span className="text-xl font-black text-slate-300">%</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0" />
              <p className="text-xs font-bold text-blue-700 leading-relaxed">
                Fees are automatically deducted during payout processing.
              </p>
            </div>
          </SettingsCard>
        </TabsContent>

        <TabsContent
          value="notifications"
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
        >
          <SettingsCard
            icon={<Bell className="text-amber-500" />}
            title="System Alerts"
            description="Choose which events trigger an admin email."
            className="max-w-3xl"
          >
            <div className="divide-y divide-slate-50">
              {[
                "New KYC Submission",
                "High-Priority User Report",
                "Large Order (over ₹10,000)",
                "Failed Payment Attempt",
              ].map((alert) => (
                <div
                  key={alert}
                  className="flex items-center justify-between py-5 first:pt-0 last:pb-0"
                >
                  <div>
                    <Label className="font-black text-sm text-slate-900 uppercase tracking-tight">
                      {alert}
                    </Label>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      Push & Email
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-orange-600"
                  />
                </div>
              ))}
            </div>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsCard({ icon, title, description, children, className }: any) {
  return (
    <Card
      className={`border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden ${className}`}
    >
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-slate-50">{icon}</div>
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">
              {title}
            </CardTitle>
            <CardDescription className="font-medium">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 pt-4">{children}</CardContent>
    </Card>
  );
}

function ToggleItem({ label, sub }: any) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
      <div className="space-y-0.5">
        <Label className="font-black text-sm text-slate-900 uppercase tracking-tight">
          {label}
        </Label>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {sub}
        </p>
      </div>
      <Switch defaultChecked className="data-[state=checked]:bg-orange-600" />
    </div>
  );
}
