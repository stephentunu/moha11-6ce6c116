import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, c as cn } from "./router-CiepFxU2.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-w8YYfmWJ.mjs";
import { b as usePolls, l as usePollVotes, M as MATHARE_WARDS, r as resetPoll } from "./admin-store-Pu01Ao05.mjs";
import { V as Vote, au as ChartNoAxesColumn, w as Users, a as MapPin, O as Search, av as Award, o as ChevronUp, C as ChevronDown, aw as RotateCcw, k as Clock, m as TrendingUp } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, a as Pie, C as Cell, T as Tooltip, L as Legend, B as BarChart, X as XAxis, Y as YAxis, b as Bar } from "../_libs/recharts.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/zod.mjs";
import "./client-r8zzNwlx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const OPTION_COLORS = [
  "#16a34a",
  // emerald
  "#d97706",
  // amber (gold)
  "#2563eb",
  // blue
  "#9333ea",
  // purple
  "#dc2626",
  // red
  "#0891b2",
  // cyan
  "#c2410c"
  // orange
];
const WARD_COLORS = {
  Mabatini: "#16a34a",
  Huruma: "#d97706",
  Hospital: "#2563eb",
  Kiamaiko: "#9333ea",
  Ngei: "#dc2626",
  "Mlango Kubwa": "#0891b2"
};
const SERVICE_RATING_COLORS = {
  best: "#16a34a",
  fair: "#d97706",
  worst: "#dc2626"
};
function AdminPollsPage() {
  const [polls] = usePolls();
  const [voteLog] = usePollVotes();
  const [search, setSearch] = reactExports.useState("");
  const [expandedLog, setExpandedLog] = reactExports.useState(false);
  const [expandedWards, setExpandedWards] = reactExports.useState(/* @__PURE__ */ new Set());
  const grandTotal = reactExports.useMemo(() => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0), [polls]);
  const activePollsCount = polls.filter((p) => p.options.some((o) => o.votes > 0)).length;
  const votesByWard = reactExports.useMemo(() => {
    const map = {};
    for (const v of voteLog) {
      const w = v.ward ?? "Unknown";
      map[w] = (map[w] ?? 0) + 1;
    }
    return map;
  }, [voteLog]);
  const topWard = reactExports.useMemo(() => {
    const entries = Object.entries(votesByWard);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0];
  }, [votesByWard]);
  const lookup = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    polls.forEach((p) => p.options.forEach((o) => m.set(`${p.id}:${o.id}`, {
      question: p.question,
      option: o.label
    })));
    return m;
  }, [polls]);
  const filteredPolls = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return polls;
    return polls.filter((p) => p.question.toLowerCase().includes(q));
  }, [polls, search]);
  const fmtTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(ts).toLocaleDateString("en-KE");
  };
  const isServicePoll = (p) => p.options.some((o) => ["best", "fair", "worst"].includes(o.id));
  const wardPieData = MATHARE_WARDS.map((w) => ({
    name: w,
    value: votesByWard[w] ?? 0,
    fill: WARD_COLORS[w] ?? "#64748b"
  })).filter((d) => d.value > 0);
  const logEntries = expandedLog ? voteLog : voteLog.slice(0, 30);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Poll Analytics", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: Vote, label: "Total votes cast", value: grandTotal.toLocaleString(), color: "text-primary", bg: "bg-primary/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: ChartNoAxesColumn, label: "Active polls", value: `${activePollsCount} / ${polls.length}`, color: "text-blue-600", bg: "bg-blue-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: Users, label: "Unique wards voting", value: String(Object.keys(votesByWard).length), color: "text-purple-600", bg: "bg-purple-500/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, { icon: MapPin, label: "Most active ward", value: topWard ? topWard[0] : "—", sub: topWard ? `${topWard[1]} votes` : void 0, color: "text-gold", bg: "bg-gold/10" })
    ] }),
    wardPieData.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 mb-6 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Ward Participation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Votes cast per ward across all polls" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[1fr_1fr] gap-6 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-56", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: wardPieData, cx: "50%", cy: "50%", innerRadius: 55, outerRadius: 95, paddingAngle: 3, dataKey: "value", children: wardPieData.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.fill }, i)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
            fontSize: 12
          }, formatter: (v, name) => [`${v} votes`, name] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { iconType: "circle", iconSize: 8, formatter: (v) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: v }) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: MATHARE_WARDS.map((ward) => {
          const count = votesByWard[ward] ?? 0;
          const pct = grandTotal > 0 ? count / grandTotal * 100 : 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: ward }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold tabular-nums text-muted-foreground", children: [
                count,
                " (",
                pct.toFixed(1),
                "%)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-500", style: {
              width: `${pct}%`,
              background: WARD_COLORS[ward] ?? "#64748b"
            } }) })
          ] }, ward);
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search polls by question…", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 h-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 mb-8", children: [
      filteredPolls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-12", children: "No polls match your search." }),
      filteredPolls.map((poll) => {
        const total = poll.options.reduce((s, o) => s + o.votes, 0);
        const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
        const winner = sorted[0];
        const isService = isServicePoll(poll);
        const showWardBreakdown = expandedWards.has(poll.id);
        const chartData = poll.options.map((o, i) => ({
          name: o.label,
          votes: o.votes,
          pct: total > 0 ? o.votes / total * 100 : 0,
          fill: isService ? SERVICE_RATING_COLORS[o.id] ?? OPTION_COLORS[i % OPTION_COLORS.length] : OPTION_COLORS[i % OPTION_COLORS.length]
        }));
        const pollVotes = voteLog.filter((v) => v.pollId === poll.id);
        const wardBreakdown = MATHARE_WARDS.map((ward) => {
          const wardCount = pollVotes.filter((v) => v.ward === ward).length;
          return {
            ward,
            count: wardCount
          };
        }).filter((d) => d.count > 0);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-5 pb-4 border-b border-border flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartNoAxesColumn, { className: "h-4 w-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base md:text-lg text-foreground leading-snug", children: poll.question }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                    total.toLocaleString(),
                    " vote",
                    total !== 1 ? "s" : ""
                  ] }),
                  total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-emerald-600", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "h-3 w-3" }),
                      " ",
                      winner.label,
                      " leading"
                    ] })
                  ] }),
                  total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-600 font-semibold", children: "No votes yet" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              wardBreakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "text-xs", onClick: () => setExpandedWards((prev) => {
                const next = new Set(prev);
                next.has(poll.id) ? next.delete(poll.id) : next.add(poll.id);
                return next;
              }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                "Ward view",
                showWardBreakdown ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                resetPoll(poll.id);
                toast.success("Poll reset to zero");
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                " Reset"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_280px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-max", children: total === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 rounded-xl bg-muted/30 text-sm text-muted-foreground", children: "No votes recorded yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[max(180px,calc(2.8rem*var(--opts)))]", style: {
                "--opts": poll.options.length
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: Math.max(180, poll.options.length * 52), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, layout: "vertical", margin: {
                left: 8,
                right: 48,
                top: 4,
                bottom: 4
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", hide: true }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { type: "category", dataKey: "name", width: 150, tick: {
                  fontSize: 12,
                  fill: "hsl(var(--foreground))",
                  fontWeight: 500
                }, axisLine: false, tickLine: false }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { cursor: {
                  fill: "hsl(var(--muted) / 0.4)"
                }, contentStyle: {
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12
                }, formatter: (v, _, entry) => [`${v.toLocaleString()} votes (${(entry?.payload?.pct ?? 0).toFixed(1)}%)`, "Count"] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "votes", radius: [0, 6, 6, 0], label: {
                  position: "right",
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                  formatter: (v) => v > 0 ? v.toLocaleString() : ""
                }, children: chartData.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: d.fill }, i)) })
              ] }) }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Results ranked" }),
                sorted.map((o, rank) => {
                  const pct = total > 0 ? o.votes / total * 100 : 0;
                  const color = isService ? SERVICE_RATING_COLORS[o.id] ?? OPTION_COLORS[rank % OPTION_COLORS.length] : OPTION_COLORS[rank % OPTION_COLORS.length];
                  const isWinner = rank === 0 && total > 0;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("rounded-xl border px-3 py-2.5 transition-all", isWinner ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30" : "border-border bg-muted/20"), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full shrink-0", style: {
                          background: color
                        } }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-sm font-semibold truncate", isWinner && "text-emerald-700 dark:text-emerald-400"), children: [
                          isWinner && /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "inline h-3 w-3 mr-0.5 mb-0.5" }),
                          o.label
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 ml-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold tabular-nums", children: o.votes.toLocaleString() }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                          "(",
                          pct.toFixed(1),
                          "%)"
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all duration-700", style: {
                      width: `${pct}%`,
                      background: color
                    } }) })
                  ] }, o.id);
                })
              ] })
            ] }),
            showWardBreakdown && wardBreakdown.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 border-t border-border pt-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                " Votes per ward — this poll"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2", children: MATHARE_WARDS.map((ward) => {
                const count = pollVotes.filter((v) => v.ward === ward).length;
                const wardPct = pollVotes.length > 0 ? count / pollVotes.length * 100 : 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full mb-2 mx-auto", style: {
                    width: "100%",
                    background: count > 0 ? WARD_COLORS[ward] ?? "#64748b" : "hsl(var(--muted))",
                    opacity: count > 0 ? 1 : 0.3
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: ward }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-display font-bold tabular-nums mt-0.5", children: count }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                    wardPct.toFixed(0),
                    "%"
                  ] })
                ] }, ward);
              }) })
            ] })
          ] })
        ] }, poll.id);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-border flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-base", children: "Recent Vote Activity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              voteLog.length.toLocaleString(),
              " vote",
              voteLog.length !== 1 ? "s" : "",
              " recorded · latest first"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
          " Admin only"
        ] })
      ] }),
      voteLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-10 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "h-8 w-8 mx-auto mb-2 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No votes yet. Activity appears here as residents vote." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 text-[11px] uppercase tracking-wider text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold", children: "When" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold", children: "Ward" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold", children: "Poll question" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold", children: "Choice" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold", children: "Timestamp" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: logEntries.map((v, idx) => {
            const meta = lookup.get(`${v.pollId}:${v.optionId}`);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: cn("hover:bg-muted/20 transition-colors", idx % 2 === 1 && "bg-muted/10"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground tabular-nums", children: voteLog.length - idx }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-xs tabular-nums text-foreground", children: fmtTime(v.createdAt) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold text-white", style: {
                background: WARD_COLORS[v.ward ?? ""] ?? "#64748b"
              }, children: v.ward ?? "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-[260px] truncate text-muted-foreground text-xs", children: meta?.question ?? v.pollId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: meta?.option ?? v.optionId }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground tabular-nums", children: new Date(v.createdAt).toLocaleString("en-KE") })
            ] }, v.id);
          }) })
        ] }) }),
        voteLog.length > 30 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-t border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Showing ",
            logEntries.length,
            " of ",
            voteLog.length.toLocaleString(),
            " votes"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => setExpandedLog((v) => !v), children: expandedLog ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }),
            " Show less"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }),
            " Show all ",
            voteLog.length.toLocaleString()
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  bg
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", bg), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn("h-5 w-5", color) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("font-display font-bold text-xl leading-tight truncate", color), children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: sub })
    ] })
  ] });
}
export {
  AdminPollsPage as component
};
