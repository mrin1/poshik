"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  ShoppingCart,
  Filter,
  Star,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

const categories = ["All", "Food", "Toys", "Accessories", "Grooming"];

export default function PetShopPage() {
   const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: products, isLoading } = useProducts();
  const { addToCart, cartCount, isLoaded: cartLoaded } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Pet <br /> Supplies
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-emerald-600" /> Premium
            essentials for your companions[cite: 68].
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <Input
              placeholder="Search products..."
              className="h-14 pl-12 rounded-2xl border-none bg-white shadow-lg shadow-slate-200/50 font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button   onClick={() => router.push("/owner/cart")} className="h-14 px-6 rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest relative transition-all shadow-xl active:scale-95">
            <ShoppingCart className="h-5 w-5 md:mr-3" />
            <span className="hidden md:inline">Cart</span>
            {cartLoaded && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[1.8rem] overflow-hidden bg-white">
        <div className="p-4 flex items-center gap-6">
          <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-r border-slate-100 pr-6">
            <Filter className="h-4 w-4 mr-2" />
            Categories
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {categories.map((cat) => (
              <Badge
                key={cat}
                className={`px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest cursor-pointer transition-all border-none ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="group border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white transition-all hover:scale-[1.02] overflow-hidden flex flex-col"
            >
              <div className="h-52 bg-slate-50 relative flex items-center justify-center group-hover:bg-emerald-50/30 transition-colors">
                <div className="p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40">
                  <ShoppingBag className="h-10 w-10 text-slate-200 group-hover:text-emerald-200 transition-colors" />
                </div>
                <Badge className="absolute top-6 right-6 bg-white/90 text-slate-900 border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {product.category}
                </Badge>
              </div>

              <CardHeader className="p-8 pb-2 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
                    {product.shop_name}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-slate-900">
                      {product.rating || 5.0}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg font-[900] uppercase tracking-tighter text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-8 py-2">
                <div className="text-2xl font-[900] text-slate-900 tracking-tighter">
                  ₹{product.price.toLocaleString("en-IN")}
                </div>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1">
                    Only {product.stock} left in stock!
                  </p>
                )}
              </CardContent>

              <CardFooter className="p-8 pt-4">
                <Button
                  
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 ${
                    product.stock === 0
                      ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-slate-950 hover:bg-emerald-600 text-white"
                  }`}
                  disabled={product.stock === 0}
                  onClick={() => addToCart(product.id, product.stock)}
                >
                  {product.stock === 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      Add to Cart <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
