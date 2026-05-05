import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Send, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { sendBulkSms } from "@/server/sms.functions";

export const Route = createFileRoute("/admin/sms")({
  head: () => ({
    meta: [
      { title: "Bulk SMS — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminSmsPage,
});

type BulkMsg = {
  id: string;
  message: string;
  audience_ward: string | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  skipped_count: number;
  status: string;
  created_at: string;
};

const MAX_LEN = 459; // ~3 SMS segments

function AdminSmsPage() {
  const [message, setMessage] = useState("");
  const [ward, setWard] = useState<string>("all");
  const [activeCount, setActiveCount] = useState({ all: 0, byWard: {} as Record<string, number> });
  const [history, setHistory] = useState<BulkMsg[]>([]);
  const [busy, setBusy] = useState(false);

  const loadCounts = async () => {
    const { data } = await supabase
      .from("supporters" as never)
      .select("ward,opted_out");
    const rows = (data as unknown as Array<{ ward: string | null; opted_out: boolean }>) || [];
    const active = rows.filter((r) => !r.opted_out);
    const byWard: Record<string, number> = {};
    for (const r of active) {
      const k = r.ward || "—";
      byWard[k] = (byWard[k] ?? 0) + 1;
    }
    setActiveCount({ all: active.length, byWard });
  };

  const loadHistory = async () => {
    const { data } = await supabase
      .from("bulk_messages" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    setHistory((data as unknown as BulkMsg[]) || []);
  };

  useEffect(() => {
    loadCounts();
    loadHistory();
    const ch = supabase
      .channel("sms-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bulk_messages" }, () =>
        loadHistory()
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "supporters" }, () =>
        loadCounts()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const targetCount = useMemo(
    () => (ward === "all" ? activeCount.all : activeCount.byWard[ward] ?? 0),
    [ward, activeCount]
  );

  const send = async () => {
    const text = message.trim();
    if (!text) {
      toast.error("Write a message first");
      return;
    }
    if (text.length > MAX_LEN) {
      toast.error(`Message too long (max ${MAX_LEN} chars)`);
      return;
    }
    if (targetCount === 0) {
      toast.error("No active supporters in this audience");
      return;
    }
    if (!confirm(`Send this message to ${targetCount} supporter(s)?`)) return;

    setBusy(true);
    const { data: created, error } = await supabase
      .from("bulk_messages" as never)
      .insert({
        message: text,
        audience_ward: ward === "all" ? null : ward,
        total_recipients: targetCount,
      } as never)
      .select("id")
      .single();
    if (error || !created) {
      setBusy(false);
      toast.error(error?.message || "Failed to create message");
      return;
    }
    const id = (created as unknown as { id: string }).id;

    try {
      const res = await sendBulkSms({ data: { bulkMessageId: id } });
      toast.success(`Sent ${res.sent} • Failed ${res.failed} • Skipped ${res.skipped}`);
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
      loadHistory();
    }
  };

  const segments = Math.max(1, Math.ceil(message.length / 153));

  return (
    <AdminLayout title="Bulk SMS">
      <Toaster />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-6">
          <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" /> Compose message
          </h3>

          <label className="text-xs uppercase tracking-wider text-muted-foreground">Audience</label>
          <Select value={ward} onValueChange={setWard}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All supporters ({activeCount.all})</SelectItem>
              {MATHARE_WARDS.map((w) => (
                <SelectItem key={w} value={w}>
                  {w} ({activeCount.byWard[w] ?? 0})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label className="text-xs uppercase tracking-wider text-muted-foreground mt-5 block">
            Message
          </label>
          <Textarea
            rows={6}
            maxLength={MAX_LEN}
            placeholder="Write your message once — it goes to every selected supporter."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1.5"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>
              {message.length}/{MAX_LEN} chars · {segments} SMS segment{segments > 1 ? "s" : ""}
            </span>
            <span>Reply STOP to opt out is appended automatically by your provider settings.</span>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-muted/40 border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              Sending to <strong>{targetCount}</strong> active supporter
              {targetCount === 1 ? "" : "s"}
            </div>
            <Button onClick={send} disabled={busy || !message.trim() || targetCount === 0}>
              <Send className="h-4 w-4 mr-1" />
              {busy ? "Sending…" : "Send now"}
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h3 className="font-display font-bold mb-4">Audience snapshot</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">All wards</span>
              <strong>{activeCount.all}</strong>
            </li>
            {MATHARE_WARDS.map((w) => (
              <li key={w} className="flex justify-between">
                <span className="text-muted-foreground">{w}</span>
                <strong>{activeCount.byWard[w] ?? 0}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 bg-card rounded-xl border">
        <div className="p-4 border-b">
          <h3 className="font-display font-bold">Recent campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left p-3">Sent</th>
                <th className="text-left p-3">Audience</th>
                <th className="text-left p-3">Message</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Sent / Failed / Skipped / Total</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-t align-top">
                  <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(h.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{h.audience_ward || "All"}</td>
                  <td className="p-3 max-w-md">
                    <p className="line-clamp-3">{h.message}</p>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        h.status === "sent"
                          ? "default"
                          : h.status === "failed"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {h.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-mono text-xs">
                    {h.sent_count} / {h.failed_count} / {h.skipped_count} / {h.total_recipients}
                  </td>
                </tr>
              ))}
              {!history.length && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No campaigns yet.
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
