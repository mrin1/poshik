// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// This imports your Tailwind CSS globally.
// Because this file is in the same folder as globals.css, we use "./"
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

// Configure the primary font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Global SEO Metadata for the entire platform
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
    // suppressHydrationWarning prevents browser extensions from crashing the app
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
