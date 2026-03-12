"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Loader2, ChevronRight, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function EventsSection({
  data = [],
  isLoading,
}: {
  data: any[];
  isLoading: boolean;
}) {
  return (
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
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin text-orange-600 h-10 w-10 mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">
                Loading Community Events...
              </p>
            </div>
          ) : data && data.length > 0 ? (
           
            data
              .slice(0, 3)
              .map((evt: any) => (
                <EventCard
                  key={evt.id}
                  title={evt.title}
                  category={evt.type || "Meetup"}
                  date={
                    evt.date
                      ? new Date(evt.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD"
                  }
                  time={evt.time || "TBA"}
                  loc={evt.location || "Online"}
                  attendees={evt.attendees || 0}
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

  
        {!isLoading && (
          <div className="mt-16 text-center">
            <Button
              asChild
              variant="outline"
              className="rounded-2xl h-14 px-12 border-2 border-slate-200 font-bold hover:bg-white transition-all text-slate-600"
            >
              <Link href="/events">View All Community Events</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}


function EventCard({ title, category, date, time, loc, attendees }: any) {

  const getImageForType = (type: string) => {
    const images: Record<string, string> = {
      Meetup:
        "https://images.unsplash.com/photo-1541599540903-216a46ca1df0?q=80&w=1000&auto=format&fit=crop",
      Adoption:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
      Workshop:
        "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=1000&auto=format&fit=crop",
      Contest:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000&auto=format&fit=crop",
      "Pet Fair":
        "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=1000&auto=format&fit=crop",
    };
    return images[type] || images["Meetup"];
  };

  const handleJoinEvent = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    toast.info("Feature Under Development", {
      description:
        "RSVP and ticketing will be available in the next update. Stay tuned!",
      icon: <Ticket className="h-4 w-4" />,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 flex items-center justify-center">
       
        <img
          src={getImageForType(category)}
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 group-hover:scale-110"
          alt={title}
        />

        <div className="absolute top-6 left-6 flex gap-2">
          <Badge className="bg-white/90 backdrop-blur text-orange-600 border-none font-black text-[10px] uppercase px-3 py-1 rounded-lg shadow-sm">
            {category}
          </Badge>
        </div>
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
          <Ticket className="h-3 w-3 text-orange-400" /> Free Entry
        </div>
      </div>

      <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors uppercase line-clamp-2">
          {title}
        </h3>

        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Calendar className="h-4 w-4 text-orange-500" /> {date} • {time}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <MapPin className="h-4 w-4 text-orange-500" /> {loc}
          </div>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-slate-50">
          <div className="flex -space-x-2">
            {attendees > 0 &&
              [1, 2, 3]
                .slice(0, Math.min(3, attendees))
                .map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white bg-slate-200"
                  />
                ))}
            {attendees > 3 && (
              <div className="h-8 w-8 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                +{attendees - 3}
              </div>
            )}
            {attendees === 0 && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Be the first!
              </span>
            )}
          </div>
          <Button
            variant="link"
            onClick={handleJoinEvent}
            className="text-orange-600 font-bold p-0 flex items-center gap-1 group/btn text-[10px] uppercase tracking-widest"
          >
            Join Event{" "}
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
