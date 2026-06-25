import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { A as AdminLayout } from "./AdminLayout-w8YYfmWJ.mjs";
import { e as useBusinesses, b as usePolls, i as useMessages } from "./admin-store-Pu01Ao05.mjs";
import { f as Store, V as Vote, af as Inbox, ag as ArrowUpRight, ah as Activity } from "../_libs/lucide-react.mjs";
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
import "./router-CiepFxU2.mjs";
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
function AdminOverviewPage() {
  const [businesses] = useBusinesses();
  const [polls] = usePolls();
  const [messages] = useMessages();
  const totalVotes = reactExports.useMemo(() => polls.reduce((s, p) => s + p.options.reduce((a, o) => a + o.votes, 0), 0), [polls]);
  const activeBiz = businesses.filter((b) => b.status === "active").length;
  const suspended = businesses.filter((b) => b.status === "suspended").length;
  const unread = messages.filter((m) => !m.read).length;
  const stats = [{
    label: "Total Businesses",
    value: businesses.length,
    sub: `${activeBiz} active · ${suspended} suspended`,
    icon: Store,
    color: "text-primary bg-primary/10",
    to: "/admin/businesses"
  }, {
    label: "Total Votes Polled",
    value: totalVotes.toLocaleString(),
    sub: `${polls.length} active polls`,
    icon: Vote,
    color: "text-gold bg-gold/10",
    to: "/admin/polls"
  }, {
    label: "Total Messages",
    value: messages.length,
    sub: `${unread} unread`,
    icon: Inbox,
    color: "text-accent bg-accent/10",
    to: "/admin/inbox"
  }];
  const recentMessages = messages.slice(0, 5);
  const recentBusinesses = businesses.slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminLayout, { title: "Dashboard Overview", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: stats.map((s) => {
      const Icon = s.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: s.to, className: "group bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-3xl font-display font-black", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-1", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: s.sub })
      ] }, s.label);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4 text-primary" }),
            " Recent Messages"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/inbox", className: "text-xs font-semibold text-primary hover:underline", children: "View all" })
        ] }),
        recentMessages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-8 text-center", children: "No messages yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: recentMessages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-1.5 h-2 w-2 rounded-full shrink-0 ${m.read ? "bg-muted-foreground/40" : "bg-gold"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold truncate", children: [
              m.name,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-muted-foreground", children: [
                "· ",
                m.kind === "ask" ? "Ask Me" : "Opinion"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: m.body })
          ] })
        ] }, m.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-primary" }),
            " New Listings"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/businesses", className: "text-xs font-semibold text-primary hover:underline", children: "Moderate" })
        ] }),
        recentBusinesses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-8 text-center", children: "No listings yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: recentBusinesses.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: b.imageUrl, alt: b.businessName, className: "h-10 w-10 rounded-lg object-cover bg-muted shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: b.businessName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
              b.category,
              " · ",
              b.ward
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${b.status === "active" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-orange-500/10 text-orange-700 dark:text-orange-400"}`, children: b.status })
        ] }, b.id)) })
      ] })
    ] })
  ] }) });
}
export {
  AdminOverviewPage as component
};
