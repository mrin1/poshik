export interface MapPinData {
  id: string;
  title: string;
  category: "Pet" | "Clinic" | string;
  location: string;
  rating?: number;
  status: string;
  color: string;
  lat: number;
  lng: number;
}

export interface MapPin {
  id: string;
  title: string;
  category: "Pet" | "Clinic";
  location: string;
  rating?: number;
  status: string;
  color: "blue" | "emerald" | "orange";
  lat: number;
  lng: number;
}