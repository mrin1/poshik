export interface VetCardProps {
  image: string;
  name: string;
  specialty: string;
  location: string;
  rating: string;
  reviews: string;
  online: boolean;
  onBook: () => void;
}