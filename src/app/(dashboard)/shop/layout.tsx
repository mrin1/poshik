
import Navbar from "@/layout/shopPannel/Navbar";
import Sidebar from "@/layout/shopPannel/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Panel | Poshik",
  description: "Manage your inventory, orders, and business performance.",
};

export default function ShopLayout({
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
