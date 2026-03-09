"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPinData } from "@/typescript/interface/map";



const createCustomIcon = (category: string) => {
  const isClinic = category === 'Clinic';
  const bgColor = isClinic ? 'bg-blue-600' : 'bg-emerald-600';
  
  const iconSvg = isClinic 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.48 12H2"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="p-3 rounded-2xl shadow-2xl border-2 border-white ${bgColor} flex items-center justify-center transition-transform hover:scale-110" style="width: 44px; height: 44px;">
            ${iconSvg}
           </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  });
};

export default function LeafletMap({ items }: { items: MapPinData[] }) {

  const center: [number, number] = [22.5726, 88.3639];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false} 
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
      />
      {items.map((item) => (
        <Marker 
          key={item.id} 
          position={[item.lat, item.lng]} 
          icon={createCustomIcon(item.category)}
        >
      
          <Popup className="rounded-2xl">
            <div className="font-sans p-1 text-center">
              <h3 className="font-[900] uppercase text-slate-900 text-sm tracking-tighter m-0">{item.title}</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{item.category} • {item.location}</p>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 p-2 rounded-lg">
                {item.status}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}