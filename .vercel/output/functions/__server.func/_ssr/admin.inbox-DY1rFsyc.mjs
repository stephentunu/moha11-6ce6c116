import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as cn, B as Button } from "./router-CiepFxU2.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { B as Badge } from "./badge-BKIhghu5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-w8YYfmWJ.mjs";
import { i as useMessages, n as markMessageRead, o as deleteMessage } from "./admin-store-Pu01Ao05.mjs";
import { af as Inbox, al as MessageSquare, b as Mail, O as Search, n as Check, as as Trash2 } from "../_libs/lucide-react.mjs";
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
function AdminInboxPage() {
  const [messages] = useMessages();
  const [q, setQ] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    const s = q.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (filter === "opinion" && m.kind !== "opinion") return false;
      if (filter === "ask" && m.kind !== "ask") return false;
      if (!s) return true;
      return m.name.toLowerCase().includes(s) || m.body.toLowerCase().includes(s) || m.contact.toLowerCase().includes(s);
    });
  }, [messages, q, filter]);
  const selected = messages.find((m) => m.id === selectedId) || filtered[0] || null;
  const formatTime = (ts) => new Date(ts).toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Message Inbox", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 mb-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total", value: messages.length, icon: Inbox, color: "text-primary bg-primary/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Opinions", value: messages.filter((m) => m.kind === "opinion").length, icon: MessageSquare, color: "text-accent bg-accent/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Questions", value: messages.filter((m) => m.kind === "ask").length, icon: Mail, color: "text-gold bg-gold/10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-2xl shadow-sm overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[380px_1fr] min-h-[520px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b lg:border-b-0 lg:border-r border-border flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search messages…", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9 h-9" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: ["all", "unread", "opinion", "ask"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setFilter(f), className: cn("px-3 py-1 rounded-md text-xs font-semibold capitalize transition", filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"), children: f === "ask" ? "Questions" : f }, f)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-sm text-muted-foreground", children: "No messages found." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: filtered.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setSelectedId(m.id);
          if (!m.read) markMessageRead(m.id, true);
        }, className: cn("w-full text-left px-4 py-3 hover:bg-muted/50 transition", selected?.id === m.id && "bg-muted/60"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
              !m.read && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-gold shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm truncate", children: m.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground shrink-0", children: formatTime(m.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2 mb-1.5", children: m.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: cn("text-[10px]", m.kind === "ask" ? "bg-gold/10 text-gold-foreground" : "bg-accent/10 text-accent-foreground"), children: m.kind === "ask" ? "Question" : "Opinion" })
        ] }) }, m.id)) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(MessageDetail, { message: selected, onDeleted: () => setSelectedId(null) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground text-sm", children: "Select a message to read." }) })
    ] }) })
  ] });
}
function MessageDetail({
  message,
  onDeleted
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn("mb-2", message.kind === "ask" ? "bg-gold/15 text-gold-foreground border-gold/30" : "bg-accent/15 text-accent-foreground border-accent/30"), children: message.kind === "ask" ? "Ask Me" : "Opinion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold", children: message.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          message.kind === "ask" ? "Contact" : "Ward",
          ":",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: message.contact })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: new Date(message.createdAt).toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
          markMessageRead(message.id, !message.read);
          toast.success(message.read ? "Marked as unread" : "Marked as read");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
          message.read ? "Mark unread" : "Mark read"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "destructive", onClick: () => {
          deleteMessage(message.id);
          toast.success("Message deleted");
          onDeleted();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
          " Delete"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted/40 border border-border rounded-xl p-5 whitespace-pre-wrap text-sm leading-relaxed", children: message.body })
  ] });
}
function StatCard({
  label,
  value,
  icon: Icon,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-11 w-11 rounded-xl flex items-center justify-center ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-black leading-none", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: label })
    ] })
  ] });
}
export {
  AdminInboxPage as component
};
