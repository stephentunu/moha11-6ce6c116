import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-CXbsBUWo.mjs";
import { T as Textarea } from "./textarea-PZUwCibH.mjs";
import { B as Badge } from "./badge--Vxi6TND.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bbw65E3G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-J4mXK0Nj.mjs";
import { M as MATHARE_WARDS } from "./admin-store-Pu01Ao05.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
import { c as createSsrRpc } from "./createSsrRpc-C2cGivNr.mjs";
import { c as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import { al as MessageSquare, w as Users, e as Send } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
const SendSchema = objectType({
  bulkMessageId: stringType().uuid()
});
const sendBulkSms = createServerFn({
  method: "POST"
}).inputValidator((d) => SendSchema.parse(d)).handler(createSsrRpc("27aeb153a917bb953e3f5a8b11c0ab7125188fc155f7e1d966f8c50023e304b5"));
const MAX_LEN = 459;
function AdminSmsPage() {
  const [message, setMessage] = reactExports.useState("");
  const [ward, setWard] = reactExports.useState("all");
  const [activeCount, setActiveCount] = reactExports.useState({
    all: 0,
    byWard: {}
  });
  const [history, setHistory] = reactExports.useState([]);
  const [busy, setBusy] = reactExports.useState(false);
  const loadCounts = async () => {
    const {
      data
    } = await supabase.from("supporters").select("ward,opted_out");
    const rows = data || [];
    const active = rows.filter((r) => !r.opted_out);
    const byWard = {};
    for (const r of active) {
      const k = r.ward || "—";
      byWard[k] = (byWard[k] ?? 0) + 1;
    }
    setActiveCount({
      all: active.length,
      byWard
    });
  };
  const loadHistory = async () => {
    const {
      data
    } = await supabase.from("bulk_messages").select("*").order("created_at", {
      ascending: false
    }).limit(20);
    setHistory(data || []);
  };
  reactExports.useEffect(() => {
    loadCounts();
    loadHistory();
    const ch = supabase.channel("sms-changes").on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "bulk_messages"
    }, () => loadHistory()).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "supporters"
    }, () => loadCounts()).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  const targetCount = reactExports.useMemo(() => ward === "all" ? activeCount.all : activeCount.byWard[ward] ?? 0, [ward, activeCount]);
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
    const {
      data: created,
      error
    } = await supabase.from("bulk_messages").insert({
      message: text,
      audience_ward: ward === "all" ? null : ward,
      total_recipients: targetCount
    }).select("id").single();
    if (error || !created) {
      setBusy(false);
      toast.error(error?.message || "Failed to create message");
      return;
    }
    const id = created.id;
    try {
      const res = await sendBulkSms({
        data: {
          bulkMessageId: id
        }
      });
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Bulk SMS", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-lg mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5" }),
          " Compose message"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Audience" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ward, onValueChange: setWard, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", children: [
              "All supporters (",
              activeCount.all,
              ")"
            ] }),
            MATHARE_WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: w, children: [
              w,
              " (",
              activeCount.byWard[w] ?? 0,
              ")"
            ] }, w))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs uppercase tracking-wider text-muted-foreground mt-5 block", children: "Message" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 6, maxLength: MAX_LEN, placeholder: "Write your message once — it goes to every selected supporter.", value: message, onChange: (e) => setMessage(e.target.value), className: "mt-1.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            message.length,
            "/",
            MAX_LEN,
            " chars · ",
            segments,
            " SMS segment",
            segments > 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reply STOP to opt out is appended automatically by your provider settings." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 p-4 rounded-lg bg-muted/40 border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
            "Sending to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: targetCount }),
            " active supporter",
            targetCount === 1 ? "" : "s"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: send, disabled: busy || !message.trim() || targetCount === 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-1" }),
            busy ? "Sending…" : "Send now"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold mb-4", children: "Audience snapshot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "All wards" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: activeCount.all })
          ] }),
          MATHARE_WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: w }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: activeCount.byWard[w] ?? 0 })
          ] }, w))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-card rounded-xl border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold", children: "Recent campaigns" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/50 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Sent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Audience" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right p-3", children: "Sent / Failed / Skipped / Total" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t align-top", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 whitespace-nowrap text-xs text-muted-foreground", children: new Date(h.created_at).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: h.audience_ward || "All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "line-clamp-3", children: h.message }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: h.status === "sent" ? "default" : h.status === "failed" ? "destructive" : "secondary", children: h.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right font-mono text-xs", children: [
              h.sent_count,
              " / ",
              h.failed_count,
              " / ",
              h.skipped_count,
              " / ",
              h.total_recipients
            ] })
          ] }, h.id)),
          !history.length && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-8 text-center text-muted-foreground", children: "No campaigns yet." }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  AdminSmsPage as component
};
