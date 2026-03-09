export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed?: string;
  age_years?: number; 
  gender?: string;
  weight_kg?: number; 
  vaccination_history?: string;
  medical_records?: string;
  is_discoverable: boolean;
  location_lat?: number;
  location_lng?: number;
}

export interface Doctor {
  id: string;
  full_name: string;
  email: string;
  specialty?: string;
  location?: string;
  fee?: number;
  rating?: number;
  reviews?: number;
}