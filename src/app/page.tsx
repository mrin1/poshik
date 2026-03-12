"use client";

import { useEffect, useState } from "react";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import { useHomeData } from "@/hooks/useHomeData";

import HeroSection from "@/components/home/HeroSection";
import TrustSection from "@/components/home/TrustSection";
import CareSection from "@/components/home/CareSection";
import MarketplacePreview from "@/components/home/MarketplacePreview";
import EventsSection from "@/components/home/EventsSection";
import StatsSection from "@/components/home/StatsSection";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useHomeData();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <HeroSection />

        <TrustSection />

        <CareSection />

        <MarketplacePreview />

        <EventsSection data={data?.events || []} isLoading={isLoading} />
        <StatsSection stats={data?.stats} />
      </main>
      <Footer />
    </div>
  );
}
