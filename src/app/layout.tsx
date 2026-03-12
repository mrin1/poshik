// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poshik | The Ultimate Social Network for Pets",
  description:
    "Connect with local pet owners, shop for premium supplies, and book top-rated veterinarians.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col`}
      >
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReactQueryProvider>

        <Toaster position="top-right" richColors closeButton theme="light" />
      </body>
    </html>
  );
}
