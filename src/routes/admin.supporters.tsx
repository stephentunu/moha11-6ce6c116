import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Search, Trash2, UserPlus, BellOff, BellRing, Upload, FileSpreadsheet, Download } from "lucide-react";
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

type ParsedRow = { name: string; phone: string; id_number: string; ward: string | null; notes?: string };

const BATCH_SIZE = 300;

// Normalize a Kenyan-style phone: keep digits, accept 07.., 7.., +2547.., 2547..
function normalizePhone(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  const digits = String(raw).replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "+254" + digits;
  return digits;
}

function pick(obj: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const found = Object.keys(obj).find((kk) => kk.trim().toLowerCase() === k);
    if (found) {
      const v = obj[found];
      if (v !== null && v !== undefined && String(v).trim() !== "") return String(v).trim();
    }
  }
  return "";
}

function AdminSupportersPage() {
  const [list, setList] = useState<Supporter[]>([]);
  const [q, setQ] = useState("");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [form, setForm] = useState({ name: "", phone: "", id_number: "", ward: "", notes: "" });
  const [bulkPaste, setBulkPaste] = useState("");
  const [busy, setBusy] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
    const phone = normalizePhone(form.phone);
    if (!phone) {
      toast.error("Invalid phone number");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("supporters" as never).upsert(
      {
        name: form.name.trim(),
        phone,
        id_number: form.id_number.trim(),
        ward: form.ward || null,
        notes: form.notes.trim(),
      } as never,
      { onConflict: "phone" } as never
    );
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm({ name: "", phone: "", id_number: "", ward: "", notes: "" });
    toast.success("Supporter saved");
    load();
  };

  const upsertBatch = async (rows: ParsedRow[]) => {
    let inserted = 0;
    let failed = 0;
    setProgress({ done: 0, total: rows.length });
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from("supporters" as never)
        .upsert(batch as never, { onConflict: "phone" } as never);
      if (error) {
        failed += batch.length;
        console.error("Batch upsert error:", error);
      } else {
        inserted += batch.length;
      }
      setProgress({ done: Math.min(i + BATCH_SIZE, rows.length), total: rows.length });
    }
    return { inserted, failed };
  };

  const importBulk = async () => {
    const lines = bulkPaste
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) {
      toast.error("Paste at least one line");
      return;
    }
    const rows: ParsedRow[] = [];
    const skipped: string[] = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const [name, phoneRaw, id_number, ward] = parts;
      const phone = normalizePhone(phoneRaw);
      if (name && phone && id_number) {
        rows.push({ name, phone, id_number, ward: ward || null });
      } else {
        skipped.push(line);
      }
    }
    if (!rows.length) {
      toast.error("No valid rows. Format per line: Name, Phone, ID, Ward");
      return;
    }
    setImporting(true);
    const { inserted, failed } = await upsertBatch(rows);
    setImporting(false);
    setProgress(null);
    if (failed) toast.error(`${failed} rows failed`);
    toast.success(`Imported ${inserted} supporters${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`);
    setBulkPaste("");
    load();
  };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
      const rows: ParsedRow[] = [];
      const skipped: number[] = [];
      json.forEach((r, idx) => {
        const name = pick(r, ["name", "full name", "fullname", "supporter", "supporter name"]);
        const phoneRaw = pick(r, ["phone", "phone number", "mobile", "msisdn", "tel", "telephone", "contact"]);
        const id_number = pick(r, ["id", "id number", "id no", "id_number", "national id", "idno"]);
        const ward = pick(r, ["ward", "location"]);
        const notes = pick(r, ["notes", "note", "remark", "remarks"]);
        const phone = normalizePhone(phoneRaw);
        if (name && phone && id_number) {
          rows.push({ name, phone, id_number, ward: ward || null, notes });
        } else {
          skipped.push(idx + 2);
        }
      });
      if (!rows.length) {
        toast.error("No valid rows found. Required columns: name, phone, id");
        setImporting(false);
        return;
      }
      const { inserted, failed } = await upsertBatch(rows);
      if (failed) toast.error(`${failed} rows failed`);
      toast.success(
        `Imported ${inserted} from ${file.name}${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`
      );
      load();
    } catch (err) {
      console.error(err);
      toast.error("Could not read file. Use .xlsx, .xls or .csv");
    } finally {
      setImporting(false);
      setProgress(null);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { name: "Jane Doe", phone: "0712345678", id: "32145678", ward: "Mabatini", notes: "" },
      { name: "John Kamau", phone: "0723000111", id: "11223344", ward: "Huruma", notes: "" },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Supporters");
    XLSX.writeFile(wb, "supporters-template.xlsx");
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
            {busy ? "Saving…" : "Add supporter"}
          </Button>
        </div>

        <div className="bg-card rounded-xl border p-5 space-y-5">
          <div>
            <h3 className="font-display font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Import from Excel / CSV
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Pick an <code>.xlsx</code>, <code>.xls</code> or <code>.csv</code> file. Required columns:
              <code> name</code>, <code>phone</code>, <code>id</code>. Optional: <code>ward</code>, <code>notes</code>.
              Existing supporters (matched by phone) will be updated.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              className="hidden"
              onChange={onFilePicked}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => fileRef.current?.click()}
                disabled={importing}
              >
                <Upload className="h-4 w-4 mr-2" />
                {importing ? "Importing…" : "Choose file"}
              </Button>
              <Button variant="outline" onClick={downloadTemplate} disabled={importing}>
                <Download className="h-4 w-4 mr-2" /> Template
              </Button>
            </div>
            {progress && (
              <p className="text-xs text-muted-foreground mt-2">
                Processed {progress.done} / {progress.total}
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Or paste rows</h4>
            <p className="text-xs text-muted-foreground mb-2">
              One per line — format: <code>Name, Phone, ID, Ward</code>
            </p>
            <Textarea
              rows={5}
              placeholder={`Jane Doe, 0712345678, 32145678, Mabatini\nJohn Kamau, 0723000111, 11223344, Huruma`}
              value={bulkPaste}
              onChange={(e) => setBulkPaste(e.target.value)}
            />
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={importBulk}
              disabled={importing || !bulkPaste.trim()}
            >
              {importing ? "Importing…" : "Import pasted rows"}
            </Button>
          </div>
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
