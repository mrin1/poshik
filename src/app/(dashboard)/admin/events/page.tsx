"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  Filter,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { supabase } from "@/utils/supabase";
import { useAuthStore } from "@/zustand/store/useAuthStore";
import { PlatformEvent } from "@/typescript/interface/admin";

export default function AdminEventsPage() {
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [events, setEvents] = useState<PlatformEvent[]>([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    type: "Meetup",
  });

  useEffect(() => {
    setMounted(true);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          organizer:register!organizer_id ( full_name )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedEvents: PlatformEvent[] = (data || []).map((evt: any) => ({
        id: evt.id,
        title: evt.title,
        organizer: evt.organizer?.full_name || "System Admin",
        date: new Date(evt.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: evt.time,
        location: evt.location,
        attendees: evt.attendees || 0,
        status: evt.status,
        type: evt.type,
      }));

      setEvents(formattedEvents);
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("You must be logged in to create events.");

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .insert({
          organizer_id: user.id,
          title: newEvent.title,
          date: newEvent.date,
          time: newEvent.time,
          location: newEvent.location,
          type: newEvent.type,
          status: "APPROVED",
        })
        .select(`*, organizer:register!organizer_id ( full_name )`)
        .single();

      if (error) throw error;

      const newEvtFormatted: PlatformEvent = {
        id: data.id,
        title: data.title,
        organizer: data.organizer?.full_name || "System Admin",
        date: new Date(data.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: data.time,
        location: data.location,
        attendees: data.attendees || 0,
        status: data.status,
        type: data.type,
      };

      setEvents([newEvtFormatted, ...events]);
      setIsDialogOpen(false);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "",
        type: "Meetup",
      });
    } catch (error: any) {
      console.error("Error creating event:", error.message);
      alert("Failed to create event. Check database permissions.");
    } finally {
      setIsCreating(false);
    }
  };

  const updateEventStatus = async (id: string, newStatus: string) => {
    setEvents(
      events.map((evt) =>
        evt.id === id ? { ...evt, status: newStatus as any } : evt,
      ),
    );

    try {
      const { error } = await supabase
        .from("events")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      alert("Failed to update status.");
      fetchEvents();
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || evt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, events]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-[900] uppercase tracking-tighter text-slate-900 leading-none">
            Event <br /> Moderation
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Maintain community safety by reviewing user-created meetups.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="h-14 px-8 bg-slate-950 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200"
        >
          <Plus className="h-5 w-5 mr-2" /> Create Official Event
        </Button>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title, organizer, or location..."
              className="h-14 pl-12 rounded-xl border-none bg-slate-50 font-bold placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-14 w-full md:w-[200px] rounded-xl border-none bg-slate-50 font-black uppercase tracking-widest text-[10px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-2xl">
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Loading Community Events...
          </p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            No events found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8">
          {filteredEvents.map((evt) => (
            <Card
              key={evt.id}
              className="group relative border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white transition-all hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
            >
              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <Badge
                    className={`px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest border-none ${
                      evt.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : evt.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {evt.status === "PENDING" ? "Awaiting Review" : evt.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-10 w-10 p-0 rounded-xl hover:bg-slate-50"
                      >
                        <MoreHorizontal className="h-5 w-5 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-2xl border-none shadow-2xl p-2 min-w-[180px]"
                    >
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">
                        Moderation
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 focus:bg-orange-50 focus:text-orange-600">
                        <Eye className="mr-3 h-4 w-4" /> Full Preview
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-50" />
                      {evt.status !== "APPROVED" && (
                        <DropdownMenuItem
                          onClick={() => updateEventStatus(evt.id, "APPROVED")}
                          className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700"
                        >
                          <CheckCircle className="mr-3 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                      )}
                      {evt.status !== "REJECTED" && (
                        <DropdownMenuItem
                          onClick={() => updateEventStatus(evt.id, "REJECTED")}
                          className="rounded-xl font-bold text-sm cursor-pointer py-3 px-4 text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                          <XCircle className="mr-3 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <CardTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
                  {evt.title}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-2">
                  {evt.type} • By {evt.organizer}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-4 space-y-4">
                <div className="flex items-center text-sm font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl">
                  <CalendarIcon className="h-4 w-4 mr-3 text-slate-400" />
                  <span>
                    {evt.date} <span className="text-slate-300 mx-2">|</span>{" "}
                    {evt.time}
                  </span>
                </div>
                <div className="flex items-center text-sm font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl">
                  <MapPin className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="truncate">{evt.location}</span>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full border-2 border-white bg-slate-200"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {evt.attendees}+ Joined
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-black text-[10px] uppercase tracking-widest text-slate-900 group-hover:text-orange-600"
                  >
                    Analytics <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-none rounded-[2.5rem] p-8 shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-slate-900">
              Launch Event
            </DialogTitle>
            <DialogDescription className="font-bold text-orange-600 uppercase text-[10px] tracking-[0.2em] mt-1">
              Create an official platform gathering
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEvent} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Event Title
              </label>
              <Input
                required
                placeholder="e.g. Annual Pet Adoption Drive"
                className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-orange-600 shadow-sm"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Date
                </label>
                <Input
                  required
                  type="date"
                  className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-orange-600 shadow-sm"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Time
                </label>
                <Input
                  required
                  type="time"
                  className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-orange-600 shadow-sm"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Location
              </label>
              <Input
                required
                placeholder="e.g. Eco Park, New Town"
                className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-orange-600 shadow-sm"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Event Category
              </label>
              <Select
                value={newEvent.type}
                onValueChange={(val) => setNewEvent({ ...newEvent, type: val })}
              >
                <SelectTrigger className="h-14 rounded-2xl border-slate-200 font-bold focus:ring-orange-600 shadow-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="Meetup">Community Meetup</SelectItem>
                  <SelectItem value="Adoption">Adoption Drive</SelectItem>
                  <SelectItem value="Workshop">Health Workshop</SelectItem>
                  <SelectItem value="Contest">Pet Contest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 h-14 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-900 bg-slate-50 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="flex-1 h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 font-black uppercase tracking-widest text-[10px] text-white shadow-xl shadow-orange-200 transition-all"
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Publish Event"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
