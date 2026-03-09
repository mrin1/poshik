"use client";

import { useState } from "react";
import Navbar from "@/layout/home/Navbar";
import Footer from "@/layout/home/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { Search, Star, Filter, Heart, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// 🔥 OPTIMIZATION 1: Move static arrays outside component to prevent re-creation on every render
const CATEGORIES = ["Nutrition", "Toys", "Health", "Leashes", "Comfort"];

// 🔥 OPTIMIZATION 2: Dynamic online fallback images based on category for a professional look
const FALLBACK_IMAGES: Record<string, string> = {
  Nutrition: "https://images.unsplash.com/photo-1585822314491-039c3666d9c6?q=80&w=600&auto=format&fit=crop",
  Toys: "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=600&auto=format&fit=crop",
  Health: "https://images.unsplash.com/photo-1628009368231-7bb7cbcb8127?q=80&w=600&auto=format&fit=crop",
  Leashes: "https://images.unsplash.com/photo-1544437134-119c6328bc6e?q=80&w=600&auto=format&fit=crop",
  Comfort: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600&auto=format&fit=crop",
  Default: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=600&auto=format&fit=crop"
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { data: products, isLoading } = useProducts(selectedCategory, searchQuery);
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      <main className="pt-20">
        <section className="bg-slate-50 border-b border-slate-100 py-16 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="space-y-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-none px-4 py-1 rounded-full font-black uppercase tracking-widest text-[9px]">
                  Verified Pet Shops Only
                </Badge>
                <h1 className="text-5xl md:text-6xl font-[900] text-slate-900 tracking-tighter uppercase leading-none">
                  Marketplace
                </h1>
                <p className="text-slate-500 max-w-lg font-medium">
                  Discover premium supplies from verified sellers across the Poshik community.
                </p>
              </div>
              
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <Input
                  placeholder="Search pet supplies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 rounded-2xl bg-white border-none h-14 shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <Button 
                onClick={() => setSelectedCategory("All")}
                className={`rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-12 transition-all ${
                  selectedCategory === "All" ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-500'
                }`}
                variant={selectedCategory === "All" ? "default" : "outline"}
              >
                All Items
              </Button>
              {CATEGORIES.map((cat) => (
                <Button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className={`rounded-xl px-8 font-black uppercase tracking-widest text-[10px] h-12 transition-all ${
                    selectedCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:text-emerald-600'
                  }`}
                >
                  {cat}
                </Button>
              ))}
              <Button variant="ghost" className="rounded-xl px-4 text-slate-400 hover:text-emerald-600 h-12">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-emerald-600" />
              <p className="font-black uppercase tracking-widest text-[10px]">Curating supplies...</p>
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-32 text-slate-400 font-black uppercase tracking-widest text-sm bg-slate-50 rounded-[3rem]">
              No products found for "{searchQuery || selectedCategory}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {products?.map((product: any) => (
                <ProductCard 
                  key={product.id}
                  image={product.image_url || FALLBACK_IMAGES[product.category] || FALLBACK_IMAGES.Default}
                  name={product.name}
                  shop={product.shop_name}
                  price={Number(product.price)} 
                  stock={product.stock}
                  onAdd={() => addToCart(product.id, product.stock)} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

interface ProductCardProps {
  image: string;
  name: string;
  shop: string;
  price: number;
  stock: number;
  onAdd: () => void;
}

function ProductCard({ image, name, shop, price, stock, onAdd }: ProductCardProps) {
  return (
    <div className="group cursor-pointer flex flex-col h-full">
      <div className="aspect-square rounded-[2.5rem] mb-6 relative overflow-hidden bg-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl">
        <img 
          src={image} 
          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" 
          alt={name} 
          loading="lazy" 
        />
        
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-black flex items-center gap-1 shadow-sm text-slate-900">
            <Star className="h-3 w-3 text-amber-500 fill-current" /> 4.9
          </div>
          {stock <= 5 && stock > 0 && (
            <div className="bg-orange-600/90 backdrop-blur text-white px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest">
              Only {stock} left
            </div>
          )}
        </div>

        <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-red-500 transition-colors">
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute bottom-6 left-6 right-6 translate-y-24 group-hover:translate-y-0 transition-transform duration-500">
          <Button 
            disabled={stock === 0}
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
            className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
              stock === 0 ? "bg-slate-800 text-slate-400" : "bg-slate-950 hover:bg-emerald-600 text-white"
            }`}
          >
            {stock === 0 ? "Out of Stock" : "Add to Basket"}
          </Button>
        </div>
      </div>

      <div className="px-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-[900] text-slate-900 leading-none group-hover:text-emerald-600 line-clamp-2">
            {name}
          </h3>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1 mt-2">
             {shop} <ArrowRight className="h-3 w-3" />
          </p>
        </div>
        <p className="text-2xl font-[900] text-slate-900 pt-4">
          ₹{price.toLocaleString("en-IN")}
        </p>
      </div>
    </div>
  );
}