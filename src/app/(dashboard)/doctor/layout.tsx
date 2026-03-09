import type { Metadata } from "next";
import Navbar from "@/layout/doctorPannel/Navbar";
import Sidebar from "@/layout/doctorPannel/Sidebar";

export const metadata: Metadata = {
    title: "Doctor Panel | Poshik",
    description: "Manage your veterinary appointments and patients on Poshik.",
};

export default function DoctorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex flex-row flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}