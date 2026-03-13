import { CalendarDays, LayoutDashboard, MessageSquare, Users } from "lucide-react";

export const sidebarLinks = [
  { name: "Overview", href: "/doctor", icon: LayoutDashboard },
  { name: "My Schedule", href: "/doctor/schedule", icon: CalendarDays },
  { name: "Patient Records", href: "/doctor/appointments", icon: Users },
  { name: "Consultations", href: "/doctor/messages", icon: MessageSquare },
];