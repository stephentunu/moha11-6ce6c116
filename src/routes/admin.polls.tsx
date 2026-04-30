import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { RotateCcw, Vote, TrendingUp, Clock } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { usePolls, usePollVotes, resetPoll } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/polls")({
  head: () => ({
    meta: [
      { title: "Poll Analytics — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPollsPage,
});

const PALETTE = ["hsl(var(--primary))", "hsl(var(--gold))", "#0ea5e9", "#a855f7", "#ef4444"];

function AdminPollsPage() {
  const [polls] = usePolls();
  const [voteLog] = usePollVotes();

  const grandTotal = useMemo(
    () => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0),
    [polls]
  );

  const fmtTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString();
  };

  const lookup = useMemo(() => {
    const m = new Map<string, { question: string; option: string }>();
    polls.forEach((p) =>
      p.options.forEach((o) =>
        m.set(`${p.id}:${o.id}`, { question: p.question, option: o.label })
      )
    );
    return m;
  }, [polls]);

  return (
    <AdminLayout title="Poll Analytics">
      <Toaster />
      <div className="mb-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl p-6 flex items-center justify-between gap-4 shadow-elegant">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gold/30 flex items-center justify-center">
            <Vote className="h-6 w-6 text-gold" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/70">Private results</p>
            <p className="font-display text-3xl font-black">{grandTotal.toLocaleString()} total votes</p>
          </div>
        </div>
        <span className="hidden md:flex items-center gap-1 text-xs font-semibold text-gold bg-background/10 px-3 py-1.5 rounded-full">
          <TrendingUp className="h-3 w-3" /> Visible to admin only
        </span>
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => {
          const total = poll.options.reduce((s, o) => s + o.votes, 0);
          const data = poll.options.map((o, i) => ({
            name: o.label,
            votes: o.votes,
            pct: total > 0 ? (o.votes / total) * 100 : 0,
            fill: PALETTE[i % PALETTE.length],
          }));
          const winner = [...poll.options].sort((a, b) => b.votes - a.votes)[0];

          return (
            <div key={poll.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-lg md:text-xl font-bold">{poll.question}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {total.toLocaleString()} votes · Leading:{" "}
                    <span className="font-semibold text-foreground">{winner.label}</span>
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    resetPoll(poll.id);
                    toast.success("Poll counts reset to zero");
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                        contentStyle={{
                          background: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v: number) => [`${v.toLocaleString()} votes`, "Count"]}
                      />
                      <Bar dataKey="votes" radius={[0, 6, 6, 0]}>
                        {data.map((d, i) => (
                          <Cell key={i} fill={d.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Numeric breakdown */}
                <div className="space-y-2">
                  {data
                    .slice()
                    .sort((a, b) => b.votes - a.votes)
                    .map((d) => (
                      <div
                        key={d.name}
                        className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-muted/40"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ background: d.fill }}
                          />
                          <span className="text-sm font-medium truncate">{d.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold tabular-nums">{d.votes.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground tabular-nums">
                            {d.pct.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent vote activity */}
      <div className="mt-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg md:text-xl font-bold">Recent vote activity</h2>
            <p className="text-xs text-muted-foreground">
              Timestamped log of incoming votes ({voteLog.length.toLocaleString()} recorded)
            </p>
          </div>
        </div>
        {voteLog.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No votes yet. Activity will appear here as residents vote.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 pr-3 font-semibold">When</th>
                  <th className="py-2 pr-3 font-semibold">Ward</th>
                  <th className="py-2 pr-3 font-semibold">Poll</th>
                  <th className="py-2 pr-3 font-semibold">Choice</th>
                  <th className="py-2 pr-3 font-semibold text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {voteLog.slice(0, 50).map((v) => {
                  const meta = lookup.get(`${v.pollId}:${v.optionId}`);
                  return (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2.5 pr-3 font-medium tabular-nums">{fmtTime(v.createdAt)}</td>
                      <td className="py-2.5 pr-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gold/15 text-gold text-xs font-semibold">
                          {v.ward ?? "—"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 max-w-[260px] truncate text-muted-foreground">
                        {meta?.question ?? v.pollId}
                      </td>
                      <td className="py-2.5 pr-3 font-semibold">{meta?.option ?? v.optionId}</td>
                      <td className="py-2.5 pr-3 text-right text-xs text-muted-foreground tabular-nums">
                        {new Date(v.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {voteLog.length > 50 && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Showing latest 50 of {voteLog.length.toLocaleString()} votes
              </p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
