import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Plus, Trash2, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import {
  useActivities,
  addActivity,
  deleteActivity,
  filterUpcoming,
  MATHARE_WARDS,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/activities")({
  head: () => ({
    meta: [
      { title: "Daily Activities — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminActivitiesPage,
});

function AdminActivitiesPage() {
  const [list] = useActivities();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [ward, setWard] = useState("");

  const upcoming = filterUpcoming(list);
  const past = list.filter((a) => !upcoming.find((u) => u.id === a.id));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) {
      toast.error("Title and date are required");
      return;
    }
    addActivity({ title, description, date, time, location, ward });
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setLocation("");
    setWard("");
    toast.success("Activity scheduled");
  };

  return (
    <AdminLayout title="Daily Campaign Activities">
      <Toaster />
      <div className="grid lg:grid-cols-[400px_1fr] gap-3">
        <form
          onSubmit={submit}
          className="bg-card border border-border rounded-2xl p-3 space-y-3 h-fit"
        >
          <h2 className="font-display text-sm font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> Add activity
          </h2>
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Bursary handover" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's happening?"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mathare Social Hall" />
          </div>
          <div>
            <Label>Ward</Label>
            <select
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs"
            >
              <option value="">— Any —</option>
              {MATHARE_WARDS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full">Schedule activity</Button>
          <p className="text-xs text-muted-foreground">
            Activities automatically disappear from the homepage after their date passes.
          </p>
        </form>

        <div className="space-y-3">
          <section>
            <h3 className="font-display text-sm font-bold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Upcoming ({upcoming.length})
            </h3>
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted-foreground bg-card border border-border rounded-xl p-3">
                No upcoming activities. Schedule one on the left.
              </p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((a) => (
                  <li key={a.id} className="bg-card border border-border rounded-xl p-3 flex justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.date).toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" })}
                        {a.time && <><Clock className="h-3 w-3 ml-2" />{a.time}</>}
                      </div>
                      <p className="font-display font-bold mt-1">{a.title}</p>
                      {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                      {(a.location || a.ward) && (
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {[a.location, a.ward].filter(Boolean).join(" • ")}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteActivity(a.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {past.length > 0 && (
            <section>
              <h3 className="font-display text-sm font-bold mb-2 text-muted-foreground">Past ({past.length})</h3>
              <ul className="space-y-2">
                {past.map((a) => (
                  <li key={a.id} className="bg-muted/40 border border-border rounded-lg p-3 flex justify-between items-center text-xs">
                    <span>
                      <span className="text-muted-foreground">{a.date}</span> — {a.title}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => deleteActivity(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}