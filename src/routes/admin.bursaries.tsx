import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Send, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { sendBursarySms } from "@/lib/bursary.functions";

export const Route = createFileRoute("/admin/bursaries")({
  head: () => ({
    meta: [
      { title: "Bursary Applications — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminBursariesPage,
});

type Row = {
  id: string;
  reference: string;
  student_name: string;
  dob: string | null;
  gender: string | null;
  id_or_birth_cert_number: string | null;
  phone: string | null;
  school_name: string;
  current_grade: string;
  kcse_year: string | null;
  guardian_name: string;
  guardian_phone: string;
  ward: string | null;
  residence_estate: string | null;
  household_income_band: string | null;
  siblings_in_school: number | null;
  amount_requested: number | null;
  reason: string | null;
  status: string;
  admin_notes: string | null;
  sms_last_sent_at: string | null;
  sms_last_message: string | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  reviewing: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

function AdminBursariesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Row | null>(null);
  const [smsOpen, setSmsOpen] = useState(false);
  const [smsTarget, setSmsTarget] = useState<Row | null>(null);
  const [smsText, setSmsText] = useState("");
  const [smsBusy, setSmsBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase
      .from("bursary_applications" as never)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data as unknown as Row[]) || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("bursary-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bursary_applications" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const counts = useMemo(() => {
    const c = { all: rows.length, pending: 0, reviewing: 0, approved: 0, rejected: 0 };
    for (const r of rows) (c as Record<string, number>)[r.status] = ((c as Record<string, number>)[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bursary_applications" as never)
      .update({ status } as never)
      .eq("id", id);
    if (error) toast.error(error.message);
    else toast.success(`Marked ${status}`);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this application permanently?")) return;
    const { error } = await supabase
      .from("bursary_applications" as never)
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted");
  };

  const openSms = (r: Row) => {
    setSmsTarget(r);
    setSmsText(
      `Hello ${r.guardian_name.split(" ")[0]}, regarding ${r.student_name}'s bursary application (Ref ${r.reference}): `,
    );
    setSmsOpen(true);
  };

  const sendSms = async () => {
    if (!smsTarget) return;
    setSmsBusy(true);
    try {
      const res = await sendBursarySms({ data: { applicationId: smsTarget.id, message: smsText } });
      if (res.simulated) toast.success(`SMS simulated to ${res.phone} (no provider creds)`);
      else toast.success(`SMS sent to ${res.phone}`);
      setSmsOpen(false);
      setSmsText("");
      setSmsTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send SMS");
    } finally {
      setSmsBusy(false);
    }
  };

  return (
    <AdminLayout title="Bursary Applications">
      <Toaster />
      <div className="space-y-6">
        <div className="grid sm:grid-cols-5 gap-3">
          {(["all", "pending", "reviewing", "approved", "rejected"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`bg-card border-2 rounded-xl p-4 text-left transition-all ${
                filter === k ? "border-primary shadow-elegant" : "border-border hover:border-primary/40"
              }`}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
              <p className="text-2xl font-display font-bold mt-1">
                {(counts as Record<string, number>)[k] ?? 0}
              </p>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Ref</th>
                  <th className="text-left px-4 py-3">Student</th>
                  <th className="text-left px-4 py-3">School / Grade</th>
                  <th className="text-left px-4 py-3">Ward</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No applications yet.
                  </td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{r.reference}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{r.student_name}</p>
                        <p className="text-xs text-muted-foreground">{r.guardian_name} · {r.guardian_phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p>{r.school_name}</p>
                        <p className="text-xs text-muted-foreground">{r.current_grade}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.ward || "—"}</td>
                      <td className="px-4 py-3 text-right font-semibold">
                        {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                          <SelectTrigger className={`h-8 w-32 text-xs font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setSelected(r)} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => openSms(r)} title="Send SMS">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => remove(r.id)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold" />
                  {selected.student_name}
                </DialogTitle>
                <DialogDescription>
                  Ref <span className="font-mono font-bold text-primary">{selected.reference}</span>
                  {" · "}
                  <Badge className={STATUS_COLORS[selected.status] ?? ""}>{selected.status}</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <Detail label="DOB" value={selected.dob} />
                <Detail label="Gender" value={selected.gender} />
                <Detail label="ID / Birth cert" value={selected.id_or_birth_cert_number} />
                <Detail label="Student phone" value={selected.phone} />
                <Detail label="School" value={selected.school_name} />
                <Detail label="Grade" value={selected.current_grade} />
                <Detail label="KCSE year" value={selected.kcse_year} />
                <Detail label="Guardian" value={`${selected.guardian_name} · ${selected.guardian_phone}`} />
                <Detail label="Ward" value={selected.ward} />
                <Detail label="Estate" value={selected.residence_estate} />
                <Detail label="Income band" value={selected.household_income_band} />
                <Detail label="Siblings in school" value={String(selected.siblings_in_school ?? "0")} />
                <Detail label="Amount requested" value={selected.amount_requested ? `KSh ${Number(selected.amount_requested).toLocaleString()}` : null} />
                <Detail label="Submitted" value={new Date(selected.created_at).toLocaleString()} />
              </div>
              {selected.reason && (
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm whitespace-pre-line bg-muted/40 p-3 rounded-lg">{selected.reason}</p>
                </div>
              )}
              {selected.sms_last_message && (
                <div className="mt-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Last SMS · {selected.sms_last_sent_at ? new Date(selected.sms_last_sent_at).toLocaleString() : ""}
                  </p>
                  <p className="text-sm bg-gold/10 p-3 rounded-lg">{selected.sms_last_message}</p>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button variant="hero" onClick={() => { openSms(selected); setSelected(null); }}>
                  <Send className="h-4 w-4" /> Send SMS Feedback
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* SMS dialog */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS Feedback</DialogTitle>
            <DialogDescription>
              {smsTarget && (
                <>To <strong>{smsTarget.guardian_name}</strong> ({smsTarget.guardian_phone || smsTarget.phone})</>
              )}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            rows={5}
            maxLength={459}
            placeholder="Your message…"
          />
          <p className="text-xs text-muted-foreground">{smsText.length}/459 characters</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={sendSms} disabled={smsBusy || smsText.trim().length === 0}>
              <Send className="h-4 w-4" /> {smsBusy ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value || "—"}</p>
    </div>
  );
}
