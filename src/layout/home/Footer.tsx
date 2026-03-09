import { PawPrint, Mail, Globe, Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-500 pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-black text-white tracking-tighter">POSHIK</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Leading the revolution in pet social networking and care services[cite: 4, 10].
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Ecosystem</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/map" className="hover:text-orange-500 transition-colors">Pet Discovery [cite: 54]</Link></li>
            <li><Link href="/shop" className="hover:text-orange-500 transition-colors">Marketplace [cite: 67]</Link></li>
            <li><Link href="/vets" className="hover:text-orange-500 transition-colors">Vet Booking [cite: 80]</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Compliance</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">GDPR Privacy [cite: 133]</Link></li>
            <li><Link href="/kyc" className="hover:text-orange-500 transition-colors">Verification Terms [cite: 7]</Link></li>
            <li><Link href="/audit" className="hover:text-orange-500 transition-colors">Audit Logs [cite: 134]</Link></li>
          </ul>
        </div>

        <div className="space-y-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Platform Status</h4>
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </div>
          <p className="text-[10px] leading-tight">Admin-monitored 24/7 for pet safety[cite: 98].</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 text-center text-[10px] uppercase tracking-[0.2em]">
        © 2026 Poshik Platform. Built with Next.js & TypeScript[cite: 21].
      </div>
    </footer>
  );
}