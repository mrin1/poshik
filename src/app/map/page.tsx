"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import {
  Search,
  Navigation,
  Target,
  Activity,
  Loader2,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePetDiscovery } from "@/hooks/usePetDiscovery";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const Circle = dynamic(() => import("react-leaflet").then((m) => m.Circle), {
  ssr: false,
});
const MarkerClusterGroup = dynamic(() => import("react-leaflet-cluster"), {
  ssr: false,
});
const MapFlyTo = dynamic(() => import("@/components/map/MapFlyTo"), {
  ssr: false,
});

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function DiscoveryMapPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [userLoc, setUserLoc] = useState({ lat: 22.5726, lng: 88.3639 });
  const [isLocating, setIsLocating] = useState(false);
  const [customIcon, setCustomIcon] = useState<any>(null);

  const { data: pets, isLoading } = usePetDiscovery();

  useEffect(() => {
    setMounted(true);
    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const icon = L.divIcon({
        className: "user-pulse-icon",
        html: `<div class="pulse-container"><div class="pulse-dot"></div><div class="pulse-ring"></div></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      setCustomIcon(icon);
    });
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      () => {
        alert("Permission denied.");
        setIsLocating(false);
      },
    );
  };

  const filteredPets = useMemo(() => {
    if (!pets) return [];
    return pets
      .map((p) => ({
        ...p,
        distance: getDistance(userLoc.lat, userLoc.lng, p.lat, p.lng),
      }))
      .filter(
        (p) =>
          p.distance <= radius &&
          (typeFilter === "ALL" || p.species === typeFilter) &&
          (p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.breed.toLowerCase().includes(search.toLowerCase())),
      )
      .sort((a, b) => a.distance - b.distance);
  }, [pets, search, radius, typeFilter, userLoc]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <style jsx global>{`
        .user-pulse-icon {
          background: none !important;
          border: none !important;
        }
        .pulse-container {
          position: relative;
          width: 20px;
          height: 20px;
        }
        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          z-index: 2;
        }
        .pulse-ring {
          width: 20px;
          height: 20px;
          background: #10b981;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          animation: pulse 2s infinite;
          opacity: 0.4;
        }
        @keyframes pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>

      <Navbar />
      <main className="flex-1 flex flex-col pt-20">
        <div className="bg-white border-b border-slate-100 px-6 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-end gap-4">
            <div>
              <Badge className="bg-emerald-100 text-emerald-600 mb-2 border-none uppercase text-[9px] font-black tracking-widest">
                <Activity className="h-3 w-3 mr-1 animate-pulse" /> Scanning
                Radius
              </Badge>
              <h1 className="text-4xl font-[900] text-slate-900 tracking-tighter uppercase leading-none">
                Discovery Hub
              </h1>
            </div>
            <Button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="bg-slate-950 hover:bg-emerald-600 rounded-xl h-12 px-6 font-bold"
            >
              {isLocating ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Navigation className="mr-2 h-4 w-4" />
              )}{" "}
              My Location
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[750px] border-b border-slate-100 overflow-hidden">
          <div className="w-full lg:w-[400px] bg-white border-r border-slate-100 flex flex-col z-10">
            <div className="p-6 space-y-4 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search breed..."
                  className="pl-12 rounded-2xl bg-slate-50 border-none h-14 font-bold"
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="flex-1 rounded-xl border-slate-200 bg-white font-black text-[10px] uppercase h-12 px-4 outline-none border-2"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                >
                  <option value={5}>Radius: 5km</option>
                  <option value={15}>Radius: 15km</option>
                  <option value={50}>Radius: 50km</option>
                </select>
                <select
                  className="flex-1 rounded-xl border-slate-200 bg-white font-black text-[10px] uppercase h-12 px-4 outline-none border-2"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="ALL">All Species</option>
                  <option value="DOG">Dogs</option>
                  <option value="CAT">Cats</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                Showing {filteredPets.length} Pets in Range
              </p>
              {isLoading ? (
                <div className="p-8 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                  Fetching Data...
                </div>
              ) : (
                filteredPets.map((pet) => (
                  <PetListItem key={pet.id} pet={pet} />
                ))
              )}
            </div>
          </div>

          <div className="flex-1 bg-slate-100 relative">
            <MapContainer
              center={[userLoc.lat, userLoc.lng]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution="&copy; OpenStreetMap"
              />
              <MapFlyTo lat={userLoc.lat} lng={userLoc.lng} />

              <Circle
                center={[userLoc.lat, userLoc.lng]}
                radius={radius * 1000}
                pathOptions={{
                  color: "#10b981",
                  fillColor: "#10b981",
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: "5, 10",
                }}
              />

              {customIcon && (
                <Marker position={[userLoc.lat, userLoc.lng]} icon={customIcon}>
                  <Popup>
                    <p className="font-black text-[10px] uppercase text-center">
                      Your Current Location
                    </p>
                  </Popup>
                </Marker>
              )}

              <MarkerClusterGroup chunkedLoading>
                {filteredPets.map((pet) => (
                  <Marker key={pet.id} position={[pet.lat, pet.lng]}>
                    <Popup>
                      <div className="p-1 w-[160px] text-center">
                        <div className="h-24 w-full rounded-xl overflow-hidden mb-2 border border-slate-100 shadow-sm">
                          <img
                            src={pet.display_image}
                            alt={pet.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h4 className="font-black text-slate-900 uppercase tracking-tighter leading-none">
                          {pet.name}
                        </h4>
                        <p className="text-[9px] font-black text-emerald-600 mt-1">
                          {pet.distance.toFixed(1)} km away
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PetListItem({ pet }: { pet: any }) {
  return (
    <div className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl overflow-hidden border-2 border-slate-50 group-hover:border-emerald-100">
          <img
            src={pet.display_image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            {pet.name}
          </h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {pet.breed}
          </p>
        </div>
        <div className="text-right">
          <Target
            size={14}
            className="text-emerald-600 ml-auto mb-1 group-hover:scale-125 transition-transform"
          />
          <span className="text-[10px] font-black text-slate-900">
            {pet.distance.toFixed(1)} km
          </span>
        </div>
      </div>
    </div>
  );
}
