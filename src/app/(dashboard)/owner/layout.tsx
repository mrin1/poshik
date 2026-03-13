import Navbar from "@/layout/ownerPannel/Navbar";
import Sidebar from "@/layout/ownerPannel/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner Panel | Poshik",
  description: "Manage your pets, bookings, and community activities.",
};

export default function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
