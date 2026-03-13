"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapFlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 14, {
      duration: 1.5,
    });
  }, [lat, lng, map]);

  return null;
}
