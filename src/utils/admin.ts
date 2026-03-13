import { Calendar, LayoutDashboard, ShieldAlert, Users } from "lucide-react";

export const sidebarLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "KYC Approvals", href: "/admin/kyc-approvals", icon: ShieldAlert },
    { name: "User Directory", href: "/admin/users", icon: Users },
    { name: "Community Events", href: "/admin/events", icon: Calendar },
  ];