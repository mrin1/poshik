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

        <div className="min-h-screen bg-slate-50 w-full">
            {children}
        </div>
    );
}