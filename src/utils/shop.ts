import { BarChart3, LayoutDashboard, Package, ShoppingCart } from "lucide-react";

 export const sidebarLinks = [
    { name: "Dashboard", href: "/shop", icon: LayoutDashboard },
    { name: "Inventory", href: "/shop/inventory", icon: Package },
    { name: "Orders", href: "/shop/orders", icon: ShoppingCart },
    { name: "Analytics", href: "/shop/analytics", icon: BarChart3 },
  ];