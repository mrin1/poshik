"use client";

import { useEffect, useState } from "react";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Ticket,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/utils/supabase";

// Define the event interface based on your database schema
interface PublicEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

export default function EventsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
    fetchPublicEvents();
  }, []);

  const fetchPublicEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "APPROVED")
        .order("date", { ascending: true }); 

      if (error) throw error;

      const formattedEvents: PublicEvent[] = (data || []).map((evt: any) => ({
        id: evt.id,
        title: evt.title,
        type: evt.type,
        date: new Date(evt.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
        time: evt.time,
        location: evt.location,
        attendees: evt.attendees || 0,
      }));

      setEvents(formattedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageForType = (type: string) => {
    const images: Record<string, string> = {
      "Meetup": "https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000&auto=format&fit=crop",
      "Adoption": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
      "Workshop": "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop",
      "Contest": "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
      "Pet Fair": "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=1000&auto=format&fit=crop"
    };
    return images[type] || images["Meetup"];
  };

  const filteredEvents = events.filter(evt => 
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    evt.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-20">
      
        <section className="bg-orange-600 py-20 px-6 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paws.png')]" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
                Community Hub
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
                Pet Fairs & <br/>Adoption Drives
              </h1>
              <p className="text-orange-100 max-w-lg text-lg">
                Join verified community events organized by Poshik Super Admins to connect with other pet lovers.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[3rem] border border-white/20 w-full md:w-96 text-center">
              <Sparkles className="h-10 w-10 text-orange-200 mx-auto mb-4" />
              <p className="text-2xl font-black mb-2 tracking-tight">Next Big Event</p>
              <p className="text-sm font-bold text-orange-200 uppercase tracking-widest">
                {events.length > 0 ? events[0].date : "Coming Soon"}
              </p>
              <Button className="mt-6 w-full bg-white text-orange-600 hover:bg-orange-50 font-black h-12 rounded-2xl">
                Get Early Access
              </Button>
            </div>
          </div>
        </section>

  
        <section className="py-12 border-b border-slate-100 sticky top-20 bg-white/80 backdrop-blur-md z-40">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search events by name or city..." 
                className="pl-12 w-full rounded-2xl bg-slate-50 border-none h-12 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="rounded-xl border-slate-200 h-12 px-6 font-bold text-slate-600">
                This Weekend
              </Button>
              <Button className="bg-slate-900 rounded-xl h-12 px-6 font-bold hover:bg-orange-600 transition-colors">
                All Filters
              </Button>
            </div>
          </div>
        </section>


        <section className="max-w-7xl mx-auto px-6 py-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-orange-600 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Community Events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-slate-100">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No upcoming events found</p>
              <p className="text-slate-400 text-xs mt-2">Please check back later or adjust your search.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredEvents.map((evt) => (
                  <EventCard 
                    key={evt.id}
                    image={getImageForType(evt.type)}
                    title={evt.title}
                    category={evt.type}
                    date={evt.date}
                    time={evt.time}
                    loc={evt.location}
                    price="Free Entry"
                    attendees={evt.attendees}
                  />
                ))}
              </div>
              
              <div className="mt-20 text-center">
                <Button variant="outline" className="rounded-2xl h-14 px-12 border-2 border-slate-100 font-bold hover:bg-slate-50 transition-all text-slate-600">
                  Load More Community Events
                </Button>
              </div>
            </>
          )}
        </section>

        <section className="py-24 bg-slate-50 border-t border-slate-100">
           <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <div className="bg-orange-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto rotate-6 shadow-lg shadow-orange-100/50">
                <Users className="h-10 w-10 text-orange-600" />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Are you an Organization?</h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto">
                Admins and verified partners can host and promote events directly on the Poshik platform. Apply for Event Admin status today.
              </p>
              <Button className="bg-slate-900 hover:bg-orange-600 text-white rounded-2xl h-14 px-10 font-bold shadow-xl transition-all">
                Apply to Host <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function EventCard({ image, title, category, date, time, loc, price, attendees }: any) {
  return (
    <div className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110" alt={title} />
        <div className="absolute top-6 left-6 flex gap-2">
          <Badge className="bg-white/90 backdrop-blur text-orange-600 border-none font-black text-[10px] uppercase px-3 py-1 rounded-lg">
            {category}
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
           <Ticket className="h-4 w-4 text-orange-400" /> {price}
        </div>
      </div>
      
      <div className="p-8 space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">
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
             {/* Render overlapping avatars conditionally based on attendee count */}
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