"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PawPrint, Menu, X, ShoppingCart, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Pet Map", href: "/map" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Veterinarians", href: "/vets" },
    { name: "Events", href: "/events" },
  ];

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-md border-b shadow-sm py-3" : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-orange-600 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-orange-200">
            <PawPrint className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">POSHIK</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} 
              className="text-[13px] font-bold text-slate-600 uppercase tracking-widest hover:text-orange-600 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>


        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-bold text-slate-700">Login</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-slate-900 hover:bg-orange-600 text-white rounded-full px-8 h-12 shadow-xl hover:shadow-orange-100 transition-all font-bold">
              Join Community
            </Button>
          </Link>
        </div>


        <button className="lg:hidden p-2 text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg font-bold text-slate-900">
              {link.name}
            </Link>
          ))}
          <hr />
          <div className="grid grid-cols-2 gap-4">
            <Button  variant="outline" className="w-full h-12">Login</Button>
            <Button className="w-full h-12 bg-orange-600">Register</Button>
          </div>
        </div>
      )}
    </nav>
  );
}