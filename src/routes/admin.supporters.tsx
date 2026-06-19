import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "@e965/xlsx";
import {
  Search, Trash2, UserPlus, BellOff, BellRing, Upload,
  FileSpreadsheet, Download, CheckSquare, Square, X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { MATHARE_WARDS } from "@/lib/admin-store";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
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
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.filter(
      (r) =>
        (wardFilter === "all" || r.ward === wardFilter) &&
        (!s || r.name.toLowerCase().includes(s) || r.phone.includes(s) || r.id_number.includes(s))
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

  // ── Selection helpers ────────────────────────────────────────────────────
  const allFilteredIds = filtered.map((s) => s.id);
  const allChecked = allFilteredIds.length > 0 && allFilteredIds.every((id) => selected.has(id));
  const someChecked = allFilteredIds.some((id) => selected.has(id));

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allChecked) {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        allFilteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const clearSelection = () => setSelected(new Set());

  // ── Bulk actions ─────────────────────────────────────────────────────────
  const bulkDelete = async () => {
    const ids = [...selected];
    const names = list.filter((s) => ids.includes(s.id)).map((s) => s.name);
    if (!window.confirm(`Delete ${ids.length} supporter${ids.length !== 1 ? "s" : ""}?\n\n${names.slice(0, 5).join(", ")}${names.length > 5 ? ` and ${names.length - 5} more` : ""}\n\nThis cannot be undone.`)) return;
    setBulkBusy(true);
    const { error } = await supabase
      .from("supporters" as never)
      .delete()
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error(error.message); return; }
    setList((prev) => prev.filter((s) => !ids.includes(s.id)));
    clearSelection();
    toast.success(`${ids.length} supporter${ids.length !== 1 ? "s" : ""} deleted`);
    load();
  };

  const bulkOptOut = async (optedOut: boolean) => {
    const ids = [...selected];
    setBulkBusy(true);
    const { error } = await supabase
      .from("supporters" as never)
      .update({ opted_out: optedOut } as never)
      .in("id", ids);
    setBulkBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`${ids.length} supporter${ids.length !== 1 ? "s" : ""} ${optedOut ? "opted out" : "reactivated"}`);
    clearSelection();
    load();
  };

  // ── Single actions ───────────────────────────────────────────────────────
  const addOne = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.id_number.trim()) {
      toast.error("Name, phone and ID number are required");
      return;
    }
    const phone = normalizePhone(form.phone);
    if (!phone) { toast.error("Invalid phone number"); return; }
    setBusy(true);
    const { error } = await supabase.from("supporters" as never).upsert(
      { name: form.name.trim(), phone, id_number: form.id_number.trim(), ward: form.ward || null, notes: form.notes.trim() } as never,
      { onConflict: "phone" } as never
    );
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setForm({ name: "", phone: "", id_number: "", ward: "", notes: "" });
    toast.success("Supporter saved");
    load();
  };

  const upsertBatch = async (rows: ParsedRow[]) => {
    let inserted = 0; let failed = 0;
    setProgress({ done: 0, total: rows.length });
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("supporters" as never).upsert(batch as never, { onConflict: "phone" } as never);
      if (error) { failed += batch.length; } else { inserted += batch.length; }
      setProgress({ done: Math.min(i + BATCH_SIZE, rows.length), total: rows.length });
    }
    return { inserted, failed };
  };

  const importBulk = async () => {
    const lines = bulkPaste.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) { toast.error("Paste at least one line"); return; }
    const rows: ParsedRow[] = []; const skipped: string[] = [];
    for (const line of lines) {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const [name, phoneRaw, id_number, ward] = parts;
      const phone = normalizePhone(phoneRaw);
      if (name && phone && id_number) rows.push({ name, phone, id_number, ward: ward || null });
      else skipped.push(line);
    }
    if (!rows.length) { toast.error("No valid rows. Format per line: Name, Phone, ID, Ward"); return; }
    setImporting(true);
    const { inserted, failed } = await upsertBatch(rows);
    setImporting(false); setProgress(null);
    if (failed) toast.error(`${failed} rows failed`);
    toast.success(`Imported ${inserted} supporters${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`);
    setBulkPaste(""); load();
  };

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
      const rows: ParsedRow[] = []; const skipped: number[] = [];
      json.forEach((r, idx) => {
        const name = pick(r, ["name", "full name", "fullname", "supporter", "supporter name"]);
        const phoneRaw = pick(r, ["phone", "phone number", "mobile", "msisdn", "tel", "telephone", "contact"]);
        const id_number = pick(r, ["id", "id number", "id no", "id_number", "national id", "idno"]);
        const ward = pick(r, ["ward", "location"]);
        const notes = pick(r, ["notes", "note", "remark", "remarks"]);
        const phone = normalizePhone(phoneRaw);
        if (name && phone && id_number) rows.push({ name, phone, id_number, ward: ward || null, notes });
        else skipped.push(idx + 2);
      });
      if (!rows.length) { toast.error("No valid rows found. Required columns: name, phone, id"); setImporting(false); return; }
      const { inserted, failed } = await upsertBatch(rows);
      if (failed) toast.error(`${failed} rows failed`);
      toast.success(`Imported ${inserted} from ${file.name}${skipped.length ? ` · skipped ${skipped.length} invalid` : ""}`);
      load();
    } catch (err) {
      console.error(err); toast.error("Could not read file. Use .xlsx, .xls or .csv");
    } finally { setImporting(false); setProgress(null); }
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
    const { error } = await supabase.from("supporters" as never).update({ opted_out: !s.opted_out } as never).eq("id", s.id);
    if (error) toast.error(error.message);
    else load();
  };

  const removeOne = async (id: string, name: string) => {
    if (!window.confirm(`Remove "${name}" from supporters? This cannot be undone.`)) return;
    const { error } = await supabase.from("supporters" as never).delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setList((prev) => prev.filter((s) => s.id !== id));
    toast.success(`${name} removed`);
    load();
  };

  const selectedCount = selected.size;

  return (
    <AdminLayout title="Supporters">
      <Toaster />

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Stat label="Total supporters" value={stats.total} />
        <Stat label="Active (will receive SMS)" value={stats.active} />
        <Stat label="Opted out" value={stats.opted} />
      </div>

      {/* Add & Import */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl border p-5">
          <h3 className="font-display font-bold mb-4 flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add supporter
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Phone (e.g. 0712345678)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="ID number" value={form.id_number} onChange={(e) => setForm({ ...form, id_number: e.target.value })} />
            <Select value={form.ward} onValueChange={(v) => setForm({ ...form, ward: v })}>
              <SelectTrigger><SelectValue placeholder="Ward (optional)" /></SelectTrigger>
              <SelectContent>
                {MATHARE_WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea className="sm:col-span-2" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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
            </p>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onFilePicked} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => fileRef.current?.click()} disabled={importing}>
                <Upload className="h-4 w-4 mr-2" />
                {importing ? "Importing…" : "Choose file"}
              </Button>
              <Button variant="outline" onClick={downloadTemplate} disabled={importing}>
                <Download className="h-4 w-4 mr-2" /> Template
              </Button>
            </div>
            {progress && <p className="text-xs text-muted-foreground mt-2">Processed {progress.done} / {progress.total}</p>}
          </div>
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold mb-2">Or paste rows</h4>
            <p className="text-xs text-muted-foreground mb-2">One per line — format: <code>Name, Phone, ID, Ward</code></p>
            <Textarea rows={5} placeholder={`Jane Doe, 0712345678, 32145678, Mabatini\nJohn Kamau, 0723000111, 11223344, Huruma`} value={bulkPaste} onChange={(e) => setBulkPaste(e.target.value)} />
            <Button className="mt-3 w-full" variant="secondary" onClick={importBulk} disabled={importing || !bulkPaste.trim()}>
              {importing ? "Importing…" : "Import pasted rows"}
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search name, phone, ID…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={wardFilter} onValueChange={setWardFilter}>
            <SelectTrigger className="md:w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All wards</SelectItem>
              {MATHARE_WARDS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk action bar — slides in when any row is selected */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border-b border-primary/20">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CheckSquare className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm font-semibold text-primary">
                {selectedCount} supporter{selectedCount !== 1 ? "s" : ""} selected
              </span>
              <button onClick={clearSelection} className="ml-1 text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOptOut(false)}
                disabled={bulkBusy}
                className="gap-1.5"
              >
                <BellRing className="h-3.5 w-3.5 text-emerald-600" />
                Reactivate
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkOptOut(true)}
                disabled={bulkBusy}
                className="gap-1.5"
              >
                <BellOff className="h-3.5 w-3.5 text-amber-600" />
                Opt out
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={bulkDelete}
                disabled={bulkBusy}
                className="gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {selectedCount}
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                {/* Select-all checkbox */}
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={toggleAll}
                    aria-label="Select all"
                    className={cn(someChecked && !allChecked && "data-[state=unchecked]:opacity-50")}
                    data-state={allChecked ? "checked" : someChecked ? "indeterminate" : "unchecked"}
                  />
                </th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Ward</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-muted-foreground">No supporters found.</td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const isSelected = selected.has(s.id);
                  return (
                    <tr
                      key={s.id}
                      className={cn(
                        "transition-colors hover:bg-muted/20",
                        isSelected && "bg-primary/5",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(s.id)}
                          aria-label={`Select ${s.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.phone}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.id_number}</td>
                      <td className="px-4 py-3">{s.ward || "—"}</td>
                      <td className="px-4 py-3">
                        {s.opted_out
                          ? <Badge variant="destructive">Opted out</Badge>
                          : <Badge className="bg-emerald-500/15 text-emerald-700">Active</Badge>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                              Actions <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleOpt(s)}>
                              {s.opted_out
                                ? <><BellRing className="h-4 w-4 mr-2 text-emerald-600" /> Reactivate</>
                                : <><BellOff className="h-4 w-4 mr-2 text-amber-600" /> Opt out</>}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => removeOne(s.id, s.name)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing <strong className="text-foreground">{filtered.length}</strong> of{" "}
              <strong className="text-foreground">{list.length}</strong> supporters
            </span>
            {selectedCount > 0 && (
              <span className="font-semibold text-primary">{selectedCount} selected</span>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-display font-bold">{value.toLocaleString()}</p>
    </div>
  );
}