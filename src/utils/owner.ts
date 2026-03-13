import { Dog, Home, MapIcon, MessageSquare, ShoppingBag, Stethoscope } from "lucide-react";

 export const sidebarLinks = [
    { name: "Home Feed", href: "/owner", icon: Home },
    { name: "My Pets", href: "/owner/pets", icon: Dog },
    { name: "Find a Vet", href: "/owner/appointments", icon: Stethoscope },
    { name: "Services Map", href: "/owner/map", icon: MapIcon },
    { name: "Pet Shop", href: "/owner/shop", icon: ShoppingBag },
    { name: "Messages", href: "/owner/messages", icon: MessageSquare },
  ];