import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Send, Eye, Trash2, Download, Search } from "lucide-react";
import { generateBursaryPdf } from "@/lib/bursary-pdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  registration_number: string | null;
  dob: string | null;
  gender: string | null;
  phone: string | null;
  current_grade: string;
  father_alive: boolean | null;
  mother_alive: boolean | null;
  father_name: string | null;
  father_phone: string | null;
  father_occupation: string | null;
  father_national_id: string | null;
  mother_name: string | null;
  mother_phone: string | null;
  mother_occupation: string | null;
  mother_national_id: string | null;
  student_disability: boolean | null;
  student_disability_detail: string | null;

  school_name: string;
  school_category: string | null;
  school_county: string | null;
  school_sub_county: string | null;
  year_of_admission: string | null;
  student_outstanding: string | null;
  school_bank_account: string | null;

  guardian_name: string;
  guardian_phone: string;
  parent_national_id: string | null;
  parent_occupation: string | null;
  parent_residence_sub_county: string | null;
  ward: string | null;
  polling_station: string | null;
  parent_disability: boolean | null;
  parent_disability_detail: string | null;
  siblings_in_school: number | null;
  total_fee_payable: number | null;
  fee_arrears: number | null;
  monthly_budget: number | null;
  estimated_fee_balances: number | null;
  amount_requested: number | null;
  received_bursary_before: boolean | null;
  previous_bursary_source: string | null;
  previous_bursary_amount: number | null;
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
  const [search, setSearch] = useState("");
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      const amount = r.amount_requested ? String(r.amount_requested) : "";
      return (
        r.student_name.toLowerCase().includes(q) ||
        (r.school_name || "").toLowerCase().includes(q) ||
        (r.school_county || "").toLowerCase().includes(q) ||
        (r.school_sub_county || "").toLowerCase().includes(q) ||
        (r.parent_residence_sub_county || "").toLowerCase().includes(q) ||
        (r.ward || "").toLowerCase().includes(q) ||
        (r.reference || "").toLowerCase().includes(q) ||
        amount.includes(q)
      );
    });
  }, [rows, filter, search]);

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name, school, location, amount, ward or reference number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11"
          />
        </div>
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

        {/* Desktop table */}
        <div className="hidden md:block bg-card border border-border rounded-2xl overflow-hidden">
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

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No applications yet.
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs font-bold text-primary">{r.reference}</p>
                    <p className="font-semibold text-foreground">{r.student_name}</p>
                    <p className="text-xs text-muted-foreground">{r.guardian_name} · {r.guardian_phone}</p>
                  </div>
                  <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                    <SelectTrigger className={`h-7 text-[10px] font-bold uppercase ${STATUS_COLORS[r.status] ?? ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">School</p>
                    <p className="font-medium text-foreground">{r.school_name}</p>
                    <p className="text-xs text-muted-foreground">{r.current_grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</p>
                    <p className="font-semibold text-foreground">
                      {r.amount_requested ? `KSh ${Number(r.amount_requested).toLocaleString()}` : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ward</p>
                    <p className="text-foreground">{r.ward || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(r)}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openSms(r)}>
                    <Send className="h-3.5 w-3.5 mr-1" /> SMS
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)} title="Delete">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
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
              <div className="space-y-4">
                <DetailGroup title="Student">
                  <Detail label="Registration No." value={selected.registration_number} />
                  <Detail label="DOB" value={selected.dob} />
                  <Detail label="Gender" value={selected.gender} />
                  <Detail label="Grade" value={selected.current_grade} />
                  <Detail label="Father alive" value={yn(selected.father_alive)} />
                  <Detail label="Mother alive" value={yn(selected.mother_alive)} />
                  <Detail
                    label="Student disability"
                    value={selected.student_disability ? (selected.student_disability_detail || "Yes") : "No"}
                  />
                </DetailGroup>
                {selected.father_alive && (
                  <DetailGroup title="Father">
                    <Detail label="Name" value={selected.father_name} />
                    <Detail label="Phone" value={selected.father_phone} />
                    <Detail label="Occupation" value={selected.father_occupation} />
                    <Detail label="National ID" value={selected.father_national_id} />
                  </DetailGroup>
                )}
                {selected.mother_alive && (
                  <DetailGroup title="Mother">
                    <Detail label="Name" value={selected.mother_name} />
                    <Detail label="Phone" value={selected.mother_phone} />
                    <Detail label="Occupation" value={selected.mother_occupation} />
                    <Detail label="National ID" value={selected.mother_national_id} />
                  </DetailGroup>
                )}
                <DetailGroup title="School">
                  <Detail label="School" value={selected.school_name} />
                  <Detail label="Category" value={selected.school_category} />
                  <Detail label="County" value={selected.school_county} />
                  <Detail label="Sub-county" value={selected.school_sub_county} />
                  <Detail label="Year of admission" value={selected.year_of_admission} />
                  <Detail label="Bank account" value={selected.school_bank_account} />
                  <Detail label="Outstanding" value={selected.student_outstanding} full />
                </DetailGroup>
                <DetailGroup title="Parent / Guardian">
                  <Detail label="Name" value={selected.guardian_name} />
                  <Detail label="Phone" value={selected.guardian_phone} />
                  <Detail label="National ID" value={selected.parent_national_id} />
                  <Detail label="Occupation" value={selected.parent_occupation} />
                  <Detail label="Residential sub-county" value={selected.parent_residence_sub_county} />
                  <Detail label="Ward" value={selected.ward} />
                  <Detail label="Polling station" value={selected.polling_station} />
                  <Detail
                    label="Parent disability"
                    value={selected.parent_disability ? (selected.parent_disability_detail || "Yes") : "No"}
                  />
                  <Detail label="Children in school" value={String(selected.siblings_in_school ?? "0")} />
                  <Detail
                    label="Total fee payable"
                    value={selected.total_fee_payable ? `KSh ${Number(selected.total_fee_payable).toLocaleString()}` : null}
                  />
                  <Detail
                    label="Fee arrears"
                    value={selected.fee_arrears ? `KSh ${Number(selected.fee_arrears).toLocaleString()}` : null}
                  />
                  <Detail
                    label="Monthly budget"
                    value={selected.monthly_budget ? `KSh ${Number(selected.monthly_budget).toLocaleString()}` : null}
                  />
                  <Detail
                    label="Fee balances"
                    value={selected.estimated_fee_balances ? `KSh ${Number(selected.estimated_fee_balances).toLocaleString()}` : null}
                  />
                  <Detail
                    label="Amount requested"
                    value={selected.amount_requested ? `KSh ${Number(selected.amount_requested).toLocaleString()}` : null}
                  />
                  <Detail
                    label="Previously received bursary"
                    value={
                      selected.received_bursary_before
                        ? `Yes${selected.previous_bursary_source ? ` — ${selected.previous_bursary_source}` : ""}${selected.previous_bursary_amount ? ` (KSh ${Number(selected.previous_bursary_amount).toLocaleString()})` : ""}`
                        : "No"
                    }
                    full
                  />
                  <Detail label="Submitted" value={new Date(selected.created_at).toLocaleString()} />
                </DetailGroup>
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
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button variant="outline" onClick={() => downloadPdfFor(selected)}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
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

function Detail({ label, value, full }: { label: string; value: string | null | undefined; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground whitespace-pre-line">{value || "—"}</p>
    </div>
  );
}

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-muted/20 border border-border rounded-xl p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">{title}</p>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">{children}</div>
    </div>
  );
}

const yn = (v: boolean | null | undefined) => (v === null || v === undefined ? "—" : v ? "Yes" : "No");

function downloadPdfFor(r: Row) {
  generateBursaryPdf({ ...r });
}

