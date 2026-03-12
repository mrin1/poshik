export interface ProductCardProps {
  image: string;
  name: string;
  shop: string;
  price: number;
  stock: number;
  onAdd: () => void;
}