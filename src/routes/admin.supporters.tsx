import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Trash2, UserPlus, BellOff, BellRing, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { MATHARE_WARDS } from "@/lib/admin-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/supporters")({
  head: () => ({
    meta: [
      { title: "Supporters — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSupportersPage,
});

type Supporter = {
  id: string;
  name: string;
  phone: string;
  id_number: string;
  ward: string | null;
  notes: string | null;
  opted_out: boolean;
  created_at: string;
};

function AdminSupportersPage() {
  const [list, setList] = useState<Supporter[]>([]);
  const [q, setQ] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [form, setForm] = useState({ name: "", phone: "", id_number: "", ward: "", notes: "" });
  const [bulkPaste, setBulkPaste] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("supporters" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setList((data as unknown as Supporter[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("supporters-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "supporters" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter(
      (r) =>
        (wardFilter === "all" || r.ward === wardFilter) &&
        (!s ||
          r.name.toLowerCase().includes(s) ||
          r.phone.includes(s) ||
          r.id_number.includes(s))
    );
  }, [list, q, wardFilter]);

  const stats = useMemo(
    () => ({
      total: list.length,
      active: list.filter((r) => !r.opted_out).length,
      opted: list.filter((r) => r.opted_out).length,
    }),
    [list]
  );

  const addOne = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.id_number.trim()) {
      toast.error("Name, phone and ID number are required");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("supporters" as never).insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      id_number: form.id_number.trim(),
      ward: form.ward || null,
      notes: form.notes.trim(),
    } as never);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm({ name: "", phone: "", id_number: "", ward: "", notes: "" });
    toast.success("Supporter added");
  };

  const importBulk = async () => {
    const lines = bulkPaste
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) return;
    const rows: Array<{ name: string; phone: string; id_number: string; ward: string | null }> = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const [name, phone, id_number, ward] = parts;
      if (name && phone && id_number) rows.push({ name, phone, id_number, ward: ward || null });
    }
    if (!rows.length) {
      toast.error("No valid rows. Format per line: Name, Phone, ID, Ward");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("supporters" as never).insert(rows as never);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Imported ${rows.length} supporters`);
      setBulkPaste("");
    }
  };

  const toggleOpt = async (s: Supporter) => {
    const { error } = await supabase
      .from("supporters" as never)
      .update({ opted_out: !s.opted_out } as never)
      .eq("id", s.id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("supporters" as never).delete().eq("id", id);
    if (error) toast.error(error.message);
  };

  return (
    <AdminLayout title="Supporters">
      <Toaster />
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total supporters" value={stats.total} />
        <Stat label="Active (will receive)" value={stats.active} />
        <Stat label="Opted out" value={stats.opted} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add supporter
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Phone (e.g. 0712345678)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="ID number"
              value={form.id_number}
              onChange={(e) => setForm({ ...form, id_number: e.target.value })}
            />
            <Select value={form.ward} onValueChange={(v) => setForm({ ...form, ward: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Ward (optional)" />
              </SelectTrigger>
              <SelectContent>
                {MATHARE_WARDS.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              className="sm:col-span-2"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <Button className="mt-4 w-full" onClick={addOne} disabled={busy}>
            Add supporter
          </Button>
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <Upload className="h-4 w-4" /> Bulk import
          </h3>
          <p className="text-xs text-muted-foreground mb-2">
            One per line — format: <code>Name, Phone, ID, Ward</code> (Ward optional)
          </p>
          <Textarea
            rows={8}
            placeholder={`Jane Doe, 0712345678, 32145678, Mabatini\nJohn Kamau, 0723000111, 11223344, Huruma`}
            value={bulkPaste}
            onChange={(e) => setBulkPaste(e.target.value)}
          />
          <Button className="mt-4 w-full" variant="secondary" onClick={importBulk} disabled={busy}>
            Import list
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border">
        <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search name, phone, ID…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wards</SelectItem>
              {MATHARE_WARDS.map((w) => (
                <SelectItem key={w} value={w}>
                  {w}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Ward</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 font-mono text-xs">{s.phone}</td>
                  <td className="p-3 font-mono text-xs">{s.id_number}</td>
                  <td className="p-3">{s.ward || "—"}</td>
                  <td className="p-3">
                    {s.opted_out ? (
                      <Badge variant="destructive">Opted out</Badge>
                    ) : (
                      <Badge>Active</Badge>
                    )}
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <Button size="sm" variant="outline" onClick={() => toggleOpt(s)}>
                      {s.opted_out ? <BellRing className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No supporters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-display font-bold">{value}</p>
    </div>
  );
}
