"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import { useHomeData } from "@/hooks/useHomeData";
import {
  MapPin,
  ShoppingBag,
  Stethoscope,
  ShieldCheck,
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
  Loader2,
  Ticket,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading } = useHomeData();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen selection:bg-orange-100 selection:text-orange-900 font-sans">
      <Navbar />

      <main className="flex-1">

        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
          <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-orange-50 rounded-bl-[10rem] hidden lg:block" />
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest tracking-tighter">
                  Verified Community
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-[900] text-slate-900 leading-[0.85] tracking-tighter uppercase">
                Connect. <br />
                Care. <br />
                <span className="text-orange-600">Celebrate.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md font-medium leading-relaxed">
                The vibrant social hub for pet parents. Discover local friends,
                book expert vets, and access professional services.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 rounded-2xl h-16 px-10 text-lg font-black uppercase shadow-2xl shadow-orange-200 active:scale-95 transition-all"
                >
                  <Link href="/map">Explore Pet Map</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-200 rounded-2xl h-16 px-10 text-lg font-black uppercase bg-white hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <Link href="/doctors">Find a Doctor</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative group perspective-1000"
            >
              <div className="bg-slate-900 aspect-square rounded-[3rem] p-4 shadow-3xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                  className="w-full h-full object-cover rounded-[2rem] opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000"
                  alt="Map Preview"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="bg-orange-600 p-6 rounded-full shadow-2xl"
                  >
                    <MapPin className="h-10 w-10 text-white" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
            <TrustBlock
              icon={ShieldCheck}
              title="Verified KYC"
              desc="Document-backed security for all community users."
            />
            <TrustBlock
              icon={Heart}
              title="Health Track"
              desc="Integrated medical and vaccination records at your fingertips."
            />
            <TrustBlock
              icon={Stethoscope}
              title="Expert Vets"
              desc="Certified doctors and online consultations instantly."
            />
          </div>
        </section>

        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfb0def?q=80&w=1000&auto=format&fit=crop"
                className="rounded-[3rem] shadow-2xl"
                alt="Vet"
              />
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute -top-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block"
              >
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                  Available Online
                </p>
                <p className="font-black text-slate-900 text-lg uppercase tracking-tighter">
                  Dr. Sarah Roy
                </p>
              </motion.div>
            </div>
            <div className="space-y-8 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tighter uppercase leading-[1.1]">
                EXPERT CARE. <br />
                INSTANT ACCESS.
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Online Video",
                  "Clinic Visit",
                  "E-Prescription",
                  "Medical Vault",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
                  >
                    <Check className="h-4 w-4 text-orange-500" /> {t}
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                <Link href="/doctors">Book Consultation</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
              <h2 className="text-4xl font-[900] text-slate-900 tracking-tighter uppercase">
                PREMIUM MARKETPLACE
              </h2>
              <Button
                asChild
                variant="link"
                className="text-orange-600 font-black uppercase tracking-widest text-xs p-0 group"
              >
                <Link href="/shop" className="flex items-center">
                  Browse Shop{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {["Nutrition", "Wellness", "Leashes", "Comfort"].map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat}`}
                  className="group cursor-pointer bg-slate-50 border-2 border-transparent hover:border-orange-500 hover:bg-white rounded-[2.5rem] p-12 text-center transition-all duration-500"
                >
                  <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 group-hover:text-orange-600 mb-4 transition-colors" />
                  <span className="font-black text-slate-900 uppercase tracking-widest text-[10px]">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tighter uppercase">
                Community Events
              </h2>
              <p className="text-slate-500 font-medium italic">
                Handpicked meets, fairs, and training sessions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {isLoading ? (
                <div className="col-span-3 flex justify-center py-20">
                  <Loader2 className="animate-spin text-orange-600 h-10 w-10" />
                </div>
              ) : data?.events && data.events.length > 0 ? (
                data.events.map((evt: any) => (
                  <EventCard
                    key={evt.id}
                    title={evt.title}
                    category={evt.type || "Meetup"} 
                    date={
                      evt.date 
                        ? new Date(evt.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) 
                        : "TBD"
                    }
                    time={evt.time || "TBA"}
                    loc={evt.location || "Online"}
                    attendees={evt.attendees || 0}
                    img={evt.image_url} 
                  />
                ))
              ) : (
                <div className="col-span-3 py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Calendar className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                    No upcoming events scheduled
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-16 text-center">
               <Button asChild variant="outline" className="rounded-2xl h-14 px-12 border-2 border-slate-200 font-bold hover:bg-white transition-all text-slate-600">
                  <Link href="/events">View All Community Events</Link>
               </Button>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <Stat val={`${data?.stats.pets || "12k"}+`} label="Active Pets" />
            <Stat val={`${data?.stats.vets || "450"}+`} label="Verified Vets" />
            <Stat val={`${data?.stats.shops || "200"}+`} label="Local Shops" />
            <Stat val={`${data?.stats.owners || "15k"}+`} label="Pet Parents" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


interface TrustBlockProps {
  icon: any;
  title: string;
  desc: string;
}
function TrustBlock({ icon: Icon, title, desc }: TrustBlockProps) {
  return (
    <div className="space-y-6 group">
      <div className="bg-orange-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto md:mx-0 shadow-2xl shadow-orange-900/40 group-hover:rotate-[15deg] transition-transform duration-500">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-[900] uppercase tracking-tighter leading-none">
        {title}
      </h3>
      <p className="text-slate-400 font-medium text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function EventCard({ title, category, date, time, loc, attendees, img }: any) {
  const getImageForType = (type: string) => {
    const images: Record<string, string> = {
      "Meetup": "https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000&auto=format&fit=crop",
      "Adoption": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
      "Workshop": "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop",
      "Contest": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
      "Pet Fair": "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=1000&auto=format&fit=crop"
    };
    return img || images[type] || images["Meetup"];
  };

  return (
    <div className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={getImageForType(category)} 
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110" 
          alt={title} 
        />
        <div className="absolute top-6 left-6 flex gap-2">
          <Badge className="bg-white/90 backdrop-blur text-orange-600 border-none font-black text-[10px] uppercase px-3 py-1 rounded-lg">
            {category}
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
           <Ticket className="h-4 w-4 text-orange-400" /> Free Entry
        </div>
      </div>
      
      <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors uppercase line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Calendar className="h-4 w-4 text-orange-500" /> {date} • {time}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <MapPin className="h-4 w-4 text-orange-500" /> {loc}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-slate-50">
           <div className="flex -space-x-2">
             {attendees > 0 && [1, 2, 3].slice(0, Math.min(3, attendees)).map(i => (
               <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
             ))}
             {attendees > 3 && (
               <div className="h-8 w-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                 +{attendees - 3}
               </div>
             )}
             {attendees === 0 && (
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Be the first!</span>
             )}
           </div>
           <Button variant="link" className="text-orange-600 font-bold p-0 flex items-center gap-1 group/btn">
             Join Event <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
           </Button>
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  val: string;
  label: string;
}
function Stat({ val, label }: StatProps) {
  return (
    <div className="space-y-2">
      <p className="text-5xl font-[900] text-slate-900 tracking-tighter">
        {val}
      </p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
        {label}
      </p>
    </div>
  );
}