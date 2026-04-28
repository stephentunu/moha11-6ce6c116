import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { RotateCcw, Vote, TrendingUp } from "lucide-react";
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
import { usePolls, resetPoll } from "@/lib/admin-store";

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

  const grandTotal = useMemo(
    () => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0),
    [polls]
  );

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
    </AdminLayout>
  );
}
