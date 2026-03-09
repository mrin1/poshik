import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Poshik",
    description: "Manage your account and platform activities.",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // This is a simple pass-through wrapper for all protected routes.
        // Notice there are NO <html> or <body> tags here, as the Root Layout handles them.
        // There are also no Sidebars here, because the sub-layouts (like /doctor/layout.tsx) handle those.
        <div className="min-h-screen bg-slate-50 w-full">
            {children}
        </div>
    );
}