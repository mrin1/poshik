"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Clock,
  Star,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { useMapDiscovery } from "@/hooks/useMapDiscovery";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-slate-100">
      <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
    </div>
  ),
});

export default function OwnerMapPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSearch, setActiveSearch] = useState("");
  const { data: mapData, isLoading } = useMapDiscovery();

  useEffect(() => setMounted(true), []);

  const filteredResults = useMemo(() => {
    if (!mapData) return [];
    return mapData.filter(
      (item) =>
        item.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(activeSearch.toLowerCase()),
    );
  }, [mapData, activeSearch]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-10rem)] p-4 md:p-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Discovery <br /> Map
          </h1>
          <p className="text-slate-500 font-medium text-xs uppercase tracking-widest">
            Locate verified clinics & discoverable pets near you.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="w-full lg:w-[400px] flex flex-col min-h-0">
          <div className="relative group mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <Input
              placeholder="Search Clinics, Pets, Breeds..."
              className="h-14 pl-12 rounded-2xl border-none bg-white shadow-lg shadow-slate-200/50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-orange-500"
              value={activeSearch}
              onChange={(e) => setActiveSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1 pr-4 custom-scrollbar">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="space-y-4 pb-8">
                {filteredResults.map((item) => (
                  <Card
                    key={item.id}
                    className="group border-none shadow-xl shadow-slate-200/50 rounded-[2.2rem] bg-white transition-all hover:scale-[1.02] cursor-pointer overflow-hidden"
                  >
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start mb-3">
                        <Badge
                          className={`px-3 py-1 rounded-full font-black text-[8px] uppercase tracking-widest border-none ${
                            item.category === "Clinic"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {item.category}
                        </Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[10px] font-black text-slate-900">
                              {item.rating}
                            </span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg font-[900] uppercase tracking-tighter text-slate-900 leading-tight">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {item.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 space-y-4">
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 p-3 rounded-xl">
                        <Clock className="h-3.5 w-3.5 mr-2 text-blue-500" />{" "}
                        {item.status}
                      </div>
                      {item.category === "Clinic" && (
                        <div className="flex gap-2">
                          <Button className="flex-1 h-12 bg-slate-900 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg transition-all">
                            <Navigation className="h-3.5 w-3.5 mr-2" /> Book
                            Visit
                          </Button>
                          <Button
                            variant="outline"
                            className="h-12 w-12 rounded-xl border-slate-100 hover:bg-slate-50 text-slate-400 shadow-sm"
                          >
                            <Phone size={16} />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex-1 bg-slate-100 rounded-[3rem] relative overflow-hidden border-8 border-white shadow-2xl z-0">
          <div className="absolute top-6 right-6 flex flex-col gap-3 z-[1000]">
            <Button
              size="icon"
              className="h-12 w-12 bg-white/80 backdrop-blur-xl text-slate-900 shadow-xl rounded-2xl border border-white hover:bg-white"
            >
              <LocateFixed size={20} />
            </Button>
          </div>

          <LeafletMap items={filteredResults} />
        </div>
      </div>
    </div>
  );
}
