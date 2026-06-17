import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  RotateCcw, Vote, TrendingUp, Clock, Users, Award,
  BarChart2, MapPin, ChevronDown, ChevronUp, Search,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, Cell, PieChart, Pie, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/components/AdminLayout";
import { usePolls, usePollVotes, resetPoll, MATHARE_WARDS } from "@/lib/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/polls")({
  head: () => ({
    meta: [
      { title: "Poll Analytics — Admin" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPollsPage,
});

// Colour system — consistent across all charts
const OPTION_COLORS = [
  "#16a34a", // emerald
  "#d97706", // amber (gold)
  "#2563eb", // blue
  "#9333ea", // purple
  "#dc2626", // red
  "#0891b2", // cyan
  "#c2410c", // orange
];

const WARD_COLORS: Record<string, string> = {
  Mabatini:      "#16a34a",
  Huruma:        "#d97706",
  Hospital:      "#2563eb",
  Kiamaiko:      "#9333ea",
  Ngei:          "#dc2626",
  "Mlango Kubwa":"#0891b2",
};

const SERVICE_RATING_COLORS: Record<string, string> = {
  best:  "#16a34a",
  fair:  "#d97706",
  worst: "#dc2626",
};

function AdminPollsPage() {
  const [polls] = usePolls();
  const [voteLog] = usePollVotes();
  const [search, setSearch] = useState("");
  const [expandedLog, setExpandedLog] = useState(false);
  const [expandedWards, setExpandedWards] = useState<Set<string>>(new Set());

  // ── Derived stats ─────────────────────────────────────────────────────────
  const grandTotal = useMemo(
    () => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0),
    [polls],
  );

  const activePollsCount = polls.filter(
    (p) => p.options.some((o) => o.votes > 0),
  ).length;

  // Votes per ward from the vote log
  const votesByWard = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of voteLog) {
      const w = v.ward ?? "Unknown";
      map[w] = (map[w] ?? 0) + 1;
    }
    return map;
  }, [voteLog]);

  const topWard = useMemo(() => {
    const entries = Object.entries(votesByWard);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [votesByWard]);

  // Lookup for vote log display
  const lookup = useMemo(() => {
    const m = new Map<string, { question: string; option: string }>();
    polls.forEach((p) =>
      p.options.forEach((o) =>
        m.set(`${p.id}:${o.id}`, { question: p.question, option: o.label }),
      ),
    );
    return m;
  }, [polls]);

  const filteredPolls = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return polls;
    return polls.filter((p) => p.question.toLowerCase().includes(q));
  }, [polls, search]);

  const fmtTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en-KE");
  };

  // Is this a service rating poll? (options are best / fair / worst)
  const isServicePoll = (p: typeof polls[number]) =>
    p.options.some((o) => ["best", "fair", "worst"].includes(o.id));

  // Ward participation pie data
  const wardPieData = MATHARE_WARDS.map((w) => ({
    name: w,
    value: votesByWard[w] ?? 0,
    fill: WARD_COLORS[w] ?? "#64748b",
  })).filter((d) => d.value > 0);

  // Log entries shown — expand/collapse
  const logEntries = expandedLog ? voteLog : voteLog.slice(0, 30);

  return (
    <AdminLayout title="Poll Analytics">
      <Toaster />

      {/* ── KPI strip ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Vote}
          label="Total votes cast"
          value={grandTotal.toLocaleString()}
          color="text-primary"
          bg="bg-primary/10"
        />
        <KpiCard
          icon={BarChart2}
          label="Active polls"
          value={`${activePollsCount} / ${polls.length}`}
          color="text-blue-600"
          bg="bg-blue-500/10"
        />
        <KpiCard
          icon={Users}
          label="Unique wards voting"
          value={String(Object.keys(votesByWard).length)}
          color="text-purple-600"
          bg="bg-purple-500/10"
        />
        <KpiCard
          icon={MapPin}
          label="Most active ward"
          value={topWard ? topWard[0] : "—"}
          sub={topWard ? `${topWard[1]} votes` : undefined}
          color="text-gold"
          bg="bg-gold/10"
        />
      </div>

      {/* ── Ward participation overview ──────────────────────────────────────── */}
      {wardPieData.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Ward Participation</h2>
              <p className="text-xs text-muted-foreground">Votes cast per ward across all polls</p>
            </div>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-center">
            {/* Donut chart */}
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={wardPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {wardPieData.map((d, i) => (
                      <Cell key={i} fill={d.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number, name: string) => [`${v} votes`, name]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span className="text-xs text-foreground">{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Ward breakdown bars */}
            <div className="space-y-2">
              {MATHARE_WARDS.map((ward) => {
                const count = votesByWard[ward] ?? 0;
                const pct = grandTotal > 0 ? (count / grandTotal) * 100 : 0;
                return (
                  <div key={ward}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-foreground">{ward}</span>
                      <span className="text-xs font-bold tabular-nums text-muted-foreground">
                        {count} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: WARD_COLORS[ward] ?? "#64748b" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Poll search ──────────────────────────────────────────────────────── */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search polls by question…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* ── Poll cards ───────────────────────────────────────────────────────── */}
      <div className="space-y-5 mb-8">
        {filteredPolls.length === 0 && (
          <div className="text-center text-muted-foreground py-12">No polls match your search.</div>
        )}
        {filteredPolls.map((poll) => {
          const total = poll.options.reduce((s, o) => s + o.votes, 0);
          const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
          const winner = sorted[0];
          const isService = isServicePoll(poll);
          const showWardBreakdown = expandedWards.has(poll.id);

          // Bar chart data
          const chartData = poll.options.map((o, i) => ({
            name: o.label,
            votes: o.votes,
            pct: total > 0 ? (o.votes / total) * 100 : 0,
            fill: isService
              ? (SERVICE_RATING_COLORS[o.id] ?? OPTION_COLORS[i % OPTION_COLORS.length])
              : OPTION_COLORS[i % OPTION_COLORS.length],
          }));

          // Ward breakdown for this poll (from vote log)
          const pollVotes = voteLog.filter((v) => v.pollId === poll.id);
          const wardBreakdown = MATHARE_WARDS.map((ward) => {
            const wardCount = pollVotes.filter((v) => v.ward === ward).length;
            return { ward, count: wardCount };
          }).filter((d) => d.count > 0);

          return (
            <div key={poll.id} className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              {/* Poll header */}
              <div className="px-5 pt-5 pb-4 border-b border-border flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BarChart2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-base md:text-lg text-foreground leading-snug">
                      {poll.question}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground">
                        {total.toLocaleString()} vote{total !== 1 ? "s" : ""}
                      </span>
                      {total > 0 && (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <Award className="h-3 w-3" /> {winner.label} leading
                          </span>
                        </>
                      )}
                      {total === 0 && (
                        <span className="text-xs text-amber-600 font-semibold">No votes yet</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {wardBreakdown.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() =>
                        setExpandedWards((prev) => {
                          const next = new Set(prev);
                          next.has(poll.id) ? next.delete(poll.id) : next.add(poll.id);
                          return next;
                        })
                      }
                    >
                      <MapPin className="h-3 w-3" />
                      Ward view
                      {showWardBreakdown
                        ? <ChevronUp className="h-3 w-3" />
                        : <ChevronDown className="h-3 w-3" />}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetPoll(poll.id);
                      toast.success("Poll reset to zero");
                    }}
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </Button>
                </div>
              </div>

              <div className="p-5">
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                  {/* ── Horizontal bar chart ─────────────────────────────── */}
                  <div className="h-max">
                    {total === 0 ? (
                      <div className="flex items-center justify-center h-32 rounded-xl bg-muted/30 text-sm text-muted-foreground">
                        No votes recorded yet
                      </div>
                    ) : (
                      <div className="h-[max(180px,calc(2.8rem*var(--opts)))]" style={{ "--opts": poll.options.length } as React.CSSProperties}>
                        <ResponsiveContainer width="100%" height={Math.max(180, poll.options.length * 52)}>
                          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 48, top: 4, bottom: 4 }}>
                            <XAxis type="number" hide />
                            <YAxis
                              type="category"
                              dataKey="name"
                              width={150}
                              tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }}
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
                              formatter={(v: number, _: string, entry: { payload?: { pct?: number } }) => [
                                `${v.toLocaleString()} votes (${(entry?.payload?.pct ?? 0).toFixed(1)}%)`,
                                "Count",
                              ]}
                            />
                            <Bar dataKey="votes" radius={[0, 6, 6, 0]} label={{ position: "right", fontSize: 11, fill: "hsl(var(--muted-foreground))", formatter: (v: number) => v > 0 ? v.toLocaleString() : "" }}>
                              {chartData.map((d, i) => (
                                <Cell key={i} fill={d.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* ── Ranked list with progress bars ───────────────────── */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Results ranked
                    </p>
                    {sorted.map((o, rank) => {
                      const pct = total > 0 ? (o.votes / total) * 100 : 0;
                      const color = isService
                        ? (SERVICE_RATING_COLORS[o.id] ?? OPTION_COLORS[rank % OPTION_COLORS.length])
                        : OPTION_COLORS[rank % OPTION_COLORS.length];
                      const isWinner = rank === 0 && total > 0;
                      return (
                        <div
                          key={o.id}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 transition-all",
                            isWinner
                              ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
                              : "border-border bg-muted/20",
                          )}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ background: color }}
                              />
                              <span className={cn("text-sm font-semibold truncate", isWinner && "text-emerald-700 dark:text-emerald-400")}>
                                {isWinner && <Award className="inline h-3 w-3 mr-0.5 mb-0.5" />}
                                {o.label}
                              </span>
                            </div>
                            <div className="text-right shrink-0 ml-2">
                              <span className="text-sm font-bold tabular-nums">{o.votes.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground ml-1">({pct.toFixed(1)}%)</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${pct}%`, background: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Ward breakdown (expandable) ───────────────────────── */}
                {showWardBreakdown && wardBreakdown.length > 0 && (
                  <div className="mt-5 border-t border-border pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> Votes per ward — this poll
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {MATHARE_WARDS.map((ward) => {
                        const count = pollVotes.filter((v) => v.ward === ward).length;
                        const wardPct = pollVotes.length > 0 ? (count / pollVotes.length) * 100 : 0;
                        return (
                          <div
                            key={ward}
                            className="rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-center"
                          >
                            <div
                              className="h-1.5 rounded-full mb-2 mx-auto"
                              style={{
                                width: "100%",
                                background: count > 0 ? WARD_COLORS[ward] ?? "#64748b" : "hsl(var(--muted))",
                                opacity: count > 0 ? 1 : 0.3,
                              }}
                            />
                            <p className="text-xs font-semibold text-foreground">{ward}</p>
                            <p className="text-xl font-display font-bold tabular-nums mt-0.5">{count}</p>
                            <p className="text-[10px] text-muted-foreground">{wardPct.toFixed(0)}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Recent vote activity log ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base">Recent Vote Activity</h2>
              <p className="text-xs text-muted-foreground">
                {voteLog.length.toLocaleString()} vote{voteLog.length !== 1 ? "s" : ""} recorded · latest first
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3 w-3" /> Admin only
          </span>
        </div>

        {voteLog.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Vote className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No votes yet. Activity appears here as residents vote.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="text-left px-4 py-3 font-semibold">#</th>
                    <th className="text-left px-4 py-3 font-semibold">When</th>
                    <th className="text-left px-4 py-3 font-semibold">Ward</th>
                    <th className="text-left px-4 py-3 font-semibold">Poll question</th>
                    <th className="text-left px-4 py-3 font-semibold">Choice</th>
                    <th className="text-right px-4 py-3 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logEntries.map((v, idx) => {
                    const meta = lookup.get(`${v.pollId}:${v.optionId}`);
                    return (
                      <tr key={v.id} className={cn("hover:bg-muted/20 transition-colors", idx % 2 === 1 && "bg-muted/10")}>
                        <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                          {voteLog.length - idx}
                        </td>
                        <td className="px-4 py-3 font-medium text-xs tabular-nums text-foreground">
                          {fmtTime(v.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white"
                            style={{ background: WARD_COLORS[v.ward ?? ""] ?? "#64748b" }}
                          >
                            {v.ward ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-[260px] truncate text-muted-foreground text-xs">
                          {meta?.question ?? v.pollId}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground">{meta?.option ?? v.optionId}</span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                          {new Date(v.createdAt).toLocaleString("en-KE")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {voteLog.length > 30 && (
              <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Showing {logEntries.length} of {voteLog.length.toLocaleString()} votes
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedLog((v) => !v)}
                >
                  {expandedLog ? <><ChevronUp className="h-3.5 w-3.5" /> Show less</> : <><ChevronDown className="h-3.5 w-3.5" /> Show all {voteLog.length.toLocaleString()}</>}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, sub, color, bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; sub?: string;
  color: string; bg: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={cn("font-display font-bold text-xl leading-tight truncate", color)}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}