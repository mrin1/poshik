"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  ShieldBan,
  CheckCircle,
  Mail,
  Filter,
  UserX,
  ShieldCheck,
  Loader2,
} from "lucide-react";

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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { supabase } from "@/utils/supabase";
import { PlatformUser } from "@/typescript/interface/admin";

export default function AdminUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchPlatformUsers();
  }, []);

  const fetchPlatformUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("register")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedUsers: PlatformUser[] = (data || []).map((u: any) => ({
        id: u.id,
        name: u.full_name || "Unknown User",
        email: u.email,
        role: u.role,
        joined: new Date(u.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: u.account_status || "ACTIVE",
        reports: u.report_count || 0,
      }));

      setUsers(formattedUsers);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: newStatus as "ACTIVE" | "BANNED" } : u,
      ),
    );

    try {
      const { error } = await supabase
        .from("register")
        .update({ account_status: newStatus })
        .eq("id", id);

      if (error) {
        
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, status: currentStatus as "ACTIVE" | "BANNED" }
              : u,
          ),
        );
        throw error;
      }
    } catch (err: any) {
      console.error("Update Error:", err.message);
      alert("Failed to update user status. Check your database permissions.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, roleFilter, users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "DOCTOR":
        return (
          <Badge className="bg-blue-50 text-blue-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
            Vet
          </Badge>
        );
      case "SHOP":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
            Shop
          </Badge>
        );
      case "OWNER":
        return (
          <Badge className="bg-slate-50 text-slate-500 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
            Owner
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge className="bg-purple-50 text-purple-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
            Admin
          </Badge>
        );
      case "SUPER-ADMIN":
        return (
          <Badge className="bg-orange-50 text-orange-600 border-none px-3 py-1 font-black text-[9px] uppercase tracking-widest">
            S.Admin
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            User <br /> Directory
          </h1>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-orange-600" />
            {isLoading
              ? "Fetching records..."
              : `Total ${users.length} verified participants in the circle.`}
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
            <Input
              placeholder="Search by name, email, or ID..."
              className="h-14 pl-12 rounded-xl border-none bg-slate-50 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-14 w-full md:w-[180px] rounded-xl border-none bg-slate-100 font-black uppercase tracking-widest text-[10px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="OWNER">Pet Owners</SelectItem>
                <SelectItem value="DOCTOR">Veterinarians</SelectItem>
                <SelectItem value="SHOP">Pet Shops</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-14 w-14 rounded-xl border-none bg-slate-100 text-slate-600"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-8">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6 px-8">
                User Identity
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                Account Type
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                Joined
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                Safety Flags
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 py-6">
                Status
              </TableHead>
              <TableHead className="text-right py-6 px-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    Retrieving Platform Directory...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs"
                >
                  No participants found matching criteria
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className={`border-slate-50 hover:bg-slate-50/50 transition-colors ${user.status === "BANNED" ? "bg-red-50/30" : ""}`}
                >
                  <TableCell className="py-6 px-8">
                    <div className="font-black text-slate-900 uppercase tracking-tight text-sm">
                      {user.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      <Mail className="h-3 w-3" /> {user.email}
                    </div>
                  </TableCell>

                  <TableCell>{getRoleBadge(user.role)}</TableCell>

                  <TableCell className="text-xs font-bold text-slate-500 uppercase">
                    {user.joined}
                  </TableCell>

                  <TableCell>
                    {user.reports > 0 ? (
                      <Badge className="bg-orange-100 text-orange-700 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">
                        {user.reports} High Risk Reports
                      </Badge>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        Clean Slate
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    {user.status === "ACTIVE" ? (
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        <CheckCircle className="h-3.5 w-3.5 mr-2" /> Active
                      </div>
                    ) : (
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-red-600">
                        <UserX className="h-3.5 w-3.5 mr-2" /> Restricted
                      </div>
                    )}
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
                        className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]"
                      >
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                          Account Control
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 focus:bg-slate-50 focus:text-orange-600">
                          <Mail className="mr-3 h-4 w-4" /> Send Warning
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.id, user.status)}
                          className={`rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer py-3 px-4 ${
                            user.status === "ACTIVE"
                              ? "text-red-600 focus:bg-red-50 focus:text-red-700"
                              : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                          }`}
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <ShieldBan className="mr-3 h-4 w-4" /> Restrict
                              Access
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-3 h-4 w-4" /> Restore
                              Access
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
