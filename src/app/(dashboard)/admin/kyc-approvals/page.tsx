"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Eye, 
  FileText, 
  Building2, 
  Stethoscope, 
  ArrowRight, 
  ShieldCheck,
  Loader2,
  ExternalLink,
  User,
  ShieldAlert
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { supabase } from "@/utils/supabase";
import { KYCApplication } from "@/typescript/interface/admin";



export default function KYCApprovalsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<KYCApplication | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchKYCApplications();
  }, []);

  const fetchKYCApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("register")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("register")
        .update({ kyc_status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, kyc_status: newStatus as any } : app
      ));
      setIsReviewOpen(false);
    } catch (err: any) {
      console.error("Update Error:", err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApps = useMemo(() => {
    return applications.filter((app) => 
      app.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, applications]);

  const getAppsByStatus = (status: string) => filteredApps.filter(app => app.kyc_status === status);

  const openReviewDialog = (app: KYCApplication) => {
    setSelectedApp(app);
    setIsReviewOpen(true);
  };

  if (!mounted) return null;

  const renderTable = (data: KYCApplication[]) => (
    <div className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="border-slate-100">
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6 px-8">Full Name</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Account Type</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Email Address</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">Joined Date</TableHead>
            <TableHead className="text-right py-6 px-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="py-24 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 italic">Retrieving Node Records...</p>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
                No records found for this category
              </TableCell>
            </TableRow>
          ) : (
            data.map((app) => (
              <TableRow key={app.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                <TableCell className="py-6 px-8">
                  <div className="font-black text-slate-900 uppercase tracking-tight">{app.full_name || "Anonymous User"}</div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {app.id.substring(0, 8)}</div>
                </TableCell>
                <TableCell>
                  {app.role === "DOCTOR" ? (
                    <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                      <Stethoscope className="h-3 w-3 mr-1.5" /> Vet
                    </Badge>
                  ) : app.role === "SHOP" ? (
                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                      <Building2 className="h-3 w-3 mr-1.5" /> Shop
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
                      <User className="h-3 w-3 mr-1.5" /> {app.role}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-[11px] font-bold text-slate-600">{app.email}</TableCell>
                <TableCell className="text-xs font-bold text-slate-500">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right py-6 px-8">
                  <Button 
                    variant="ghost" 
                    className={`rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                        app.kyc_status === "PENDING" ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200" : "text-slate-400 bg-slate-50"
                    }`}
                    onClick={() => openReviewDialog(app)}
                  >
                    {app.kyc_status === "PENDING" ? "Review Now" : "View Details"} <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Platform <br /> Directory
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-orange-600" /> Oversee all registered users and verify platform compliance.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <Input
            placeholder="Search Name or Email..."
            className="h-14 pl-12 rounded-2xl border-none bg-white shadow-lg shadow-slate-200/50 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="h-16 inline-flex bg-slate-100 rounded-[1.5rem] p-1.5 mb-2">
          <TabsTrigger value="ALL" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900">All Registered</TabsTrigger>
          <TabsTrigger value="PENDING" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600">
            Pending <Badge className="ml-3 bg-orange-600 text-white border-none text-[9px] h-5 min-w-5">{getAppsByStatus("PENDING").length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-emerald-600">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED" className="rounded-xl px-8 font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-red-600">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ALL">{renderTable(filteredApps)}</TabsContent>
        <TabsContent value="PENDING">{renderTable(getAppsByStatus("PENDING"))}</TabsContent>
        <TabsContent value="APPROVED">{renderTable(getAppsByStatus("APPROVED"))}</TabsContent>
        <TabsContent value="REJECTED">{renderTable(getAppsByStatus("REJECTED"))}</TabsContent>
      </Tabs>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[600px] border-none rounded-[2.5rem] p-0 overflow-hidden bg-white shadow-2xl">
          <div className="bg-slate-900 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <FileText className="h-6 w-6 text-orange-500" /> Identity Verification
              </DialogTitle>
              <DialogDescription className="text-slate-400 font-medium italic">Reviewing credentials for {selectedApp?.full_name}</DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Unique Node ID</p>
                <p className="font-mono text-xs font-bold text-slate-900 truncate">{selectedApp?.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Permissions</p>
                <p className="text-sm font-bold text-slate-900 uppercase">{selectedApp?.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">KYC Documentation [cite: 37, 42]</h4>
              <div className="space-y-3">
                {selectedApp?.kyc_document_url ? (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Professional Certification</span>
                    <Button asChild variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-orange-600">
                      <a href={selectedApp.kyc_document_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> Open File
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-3xl border-slate-100 bg-slate-50/50">
                    <ShieldAlert className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No Documents Uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex gap-4">
            {selectedApp?.kyc_status === "PENDING" ? (
              <>
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-600 hover:bg-red-50 transition-colors" 
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(selectedApp.id, "REJECTED")}
                >
                  Reject
                </Button>
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-slate-900 hover:bg-orange-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl transition-all" 
                  disabled={isUpdating}
                  onClick={() => handleStatusUpdate(selectedApp.id, "APPROVED")}
                >
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Account"}
                </Button>
              </>
            ) : (
              <Button className="w-full h-14 rounded-2xl bg-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-200" onClick={() => setIsReviewOpen(false)}>Close Directory</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}