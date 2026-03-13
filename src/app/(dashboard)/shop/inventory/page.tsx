"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  AlertCircle,
  MoreHorizontal,
  Loader2,
  Activity,
  X,
} from "lucide-react";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { useInventory } from "@/hooks/useInventory";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";

export default function ShopInventoryPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
  });

  const { user } = useAuthStore();
  const { inventoryQuery, addMutation, updateMutation, deleteMutation } =
    useInventory(user?.id);
  const { data: inventory, isLoading } = inventoryQuery;

  useEffect(() => setMounted(true), []);

  const filteredItems = useMemo(() => {
    if (!inventory) return [];
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, inventory]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", sku: "", category: "", price: "", stock: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku || "",
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This cannot be undone.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveProduct = () => {
    const payload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, ...payload });
    } else {
      addMutation.mutate({ shop_id: user?.id, ...payload });
    }
    setIsModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Stock <br /> Control
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-600" /> Managing active
            SKUs for {user?.full_name}.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="h-14 px-8 bg-slate-950 hover:bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" strokeWidth={3} /> Add Product
        </Button>
      </div>

      <Card className="border-none shadow-lg rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-4 flex items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <Input
              placeholder="Search by SKU or Product Name..."
              className="h-14 pl-12 rounded-xl border-none bg-slate-50 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border-none shadow-xl rounded-[2.5rem] overflow-hidden">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Syncing Inventory...
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6 px-8">
                  Product
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                  Category
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                  Price
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                  Stock
                </TableHead>
                <TableHead className="text-right py-6 px-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest"
                  >
                    <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    No Products Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-slate-50 hover:bg-slate-50/50"
                  >
                    <TableCell className="py-6 px-8">
                      <div className="font-black text-slate-900 uppercase tracking-tight text-sm">
                        {product.name}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                        SKU: {product.sku || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-slate-100 font-bold text-[9px] uppercase tracking-widest px-3 py-1"
                      >
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-[900] text-slate-900 tracking-tighter">
                      ₹{product.price.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-black uppercase tracking-tight ${product.stock <= 5 ? "text-orange-600" : "text-slate-900"}`}
                        >
                          {product.stock} Units
                        </span>
                        {product.stock <= 5 && (
                          <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-6 px-8">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-5 w-5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]"
                        >
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(product)}
                            className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 focus:bg-slate-50"
                          >
                            <Edit3 className="mr-3 h-4 w-4" /> Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer py-3 px-4 text-red-600 focus:bg-red-50 focus:text-red-700"
                          >
                            <Trash2 className="mr-3 h-4 w-4" /> Delete SKU
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatBox
          label="Total SKUs"
          val={inventory?.length || 0}
          color="emerald"
        />
        <StatBox
          label="Low Stock"
          val={
            inventory?.filter((p) => p.stock > 0 && p.stock <= 5).length || 0
          }
          color="orange"
        />
        <StatBox
          label="Out of Stock"
          val={inventory?.filter((p) => p.stock === 0).length || 0}
          color="red"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Fill in the inventory details
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl hover:bg-slate-200"
              >
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Product Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-slate-50 border-none font-bold rounded-xl h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    SKU
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    className="bg-slate-50 border-none font-bold rounded-xl h-12"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Category
                  </label>
                  <Input
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="bg-slate-50 border-none font-bold rounded-xl h-12"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="bg-slate-50 border-none font-bold rounded-xl h-12"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Stock Limit
                  </label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="bg-slate-50 border-none font-bold rounded-xl h-12"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveProduct}
                disabled={addMutation.isPending || updateMutation.isPending}
                className="w-full h-14 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all"
              >
                {addMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : "Save Product"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, val, color }: any) {
  const colors: any = {
    emerald: "text-emerald-700",
    orange: "text-orange-700",
    red: "text-red-700",
  };
  return (
    <div className="p-6 rounded-[2rem] border-2 border-white shadow-lg shadow-slate-200/40 bg-white flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </span>
      <span className={`text-3xl font-[900] tracking-tighter ${colors[color]}`}>
        {val}
      </span>
    </div>
  );
}
