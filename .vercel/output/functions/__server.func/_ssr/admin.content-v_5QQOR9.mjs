import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button } from "./router-CiepFxU2.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { L as Label } from "./label-CrVjKyup.mjs";
import { T as Textarea } from "./textarea-DKi4YOWV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { A as AdminLayout } from "./AdminLayout-w8YYfmWJ.mjs";
import { u as useContent, d as useBursaryWindow, p as saveBursaryWindowStart, q as updateContent } from "./admin-store-Pu01Ao05.mjs";
import { a5 as House, ax as Image, ac as Upload, ay as Target, i as HeartHandshake, G as GraduationCap, aw as RotateCcw, az as Save } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function AdminContentPage() {
  const [content] = useContent();
  const [draft, setDraft] = reactExports.useState(content);
  const {
    windowStart,
    loading: windowLoading
  } = useBursaryWindow();
  const [draftWindowStart, setDraftWindowStart] = reactExports.useState("");
  const [savingWindow, setSavingWindow] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    setDraft(content);
  }, [content]);
  reactExports.useEffect(() => {
    setDraftWindowStart(windowStart);
  }, [windowStart]);
  const update = (k, v) => setDraft((d) => ({
    ...d,
    [k]: v
  }));
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("heroImageUrl", String(reader.result));
    reader.readAsDataURL(file);
  };
  const save = () => {
    updateContent(draft);
    toast.success("Content updated", {
      description: "Changes are now live on the public site."
    });
  };
  const reset = () => {
    setDraft(content);
    toast.info("Changes discarded");
  };
  const saveWindow = async (dateStr) => {
    setSavingWindow(true);
    await saveBursaryWindowStart(dateStr);
    setSavingWindow(false);
    toast.success(dateStr ? `Bursary window set — opens ${dateStr}` : "Bursary window closed");
  };
  const dirty = JSON.stringify(draft) !== JSON.stringify(content);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AdminLayout, { title: "Content Manager", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Home Page", icon: House, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Headline (large gold word)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.homeHeadline, onChange: (e) => update("homeHeadline", e.target.value), maxLength: 40 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Tagline / slogan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.homeTagline, onChange: (e) => update("homeTagline", e.target.value), maxLength: 80 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Pull quote", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: draft.homeQuote, onChange: (e) => update("homeQuote", e.target.value), rows: 3, maxLength: 300 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Quote author", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.homeQuoteAuthor, onChange: (e) => update("homeQuoteAuthor", e.target.value), maxLength: 40 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold mb-2 block", children: "Hero image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: handleImage }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-28 w-40 rounded-lg overflow-hidden bg-muted border border-border shrink-0", children: draft.heroImageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: draft.heroImageUrl, alt: "hero", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => fileRef.current?.click(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4" }),
                " Upload new image"
              ] }),
              draft.heroImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => update("heroImageUrl", ""), className: "text-destructive hover:text-destructive", children: "Use default" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Recommended: portrait orientation, at least 1200×1600px. Leave empty to use the default Moha portrait." })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Priorities Page", icon: Target, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Headline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.prioritiesHeadline, onChange: (e) => update("prioritiesHeadline", e.target.value), maxLength: 80 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subtitle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: draft.prioritiesSubtitle, onChange: (e) => update("prioritiesSubtitle", e.target.value), rows: 2, maxLength: 200 }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Foundations Page", icon: HeartHandshake, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Headline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: draft.foundationsHeadline, onChange: (e) => update("foundationsHeadline", e.target.value), maxLength: 80 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Subtitle", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: draft.foundationsSubtitle, onChange: (e) => update("foundationsSubtitle", e.target.value), rows: 2, maxLength: 200 }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { icon: GraduationCap, title: "Bursary Application Window", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-medium flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "🌐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "This setting is stored in the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "database" }),
            " and is immediately visible to all users on all devices the moment you save it."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Set the start date for the bursary application window. Applications will automatically close ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "10 days" }),
          " after the start date. Leave blank to close the window."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Application window start date", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: draftWindowStart, onChange: (e) => setDraftWindowStart(e.target.value), disabled: windowLoading, className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", onClick: () => saveWindow(draftWindowStart), disabled: savingWindow || windowLoading || draftWindowStart === windowStart, children: savingWindow ? "Saving…" : "Save & Publish" })
        ] }) }),
        windowStart && (() => {
          const start = new Date(windowStart);
          const end = new Date(start);
          end.setDate(end.getDate() + 10);
          const now = /* @__PURE__ */ new Date();
          const open = now >= start && now <= end;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `rounded-lg border px-4 py-3 text-sm font-semibold ${open ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-rose-300 bg-rose-50 text-rose-700"}`, children: open ? `✓ Window OPEN — closes ${end.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}` : now < start ? `⏳ Window opens ${start.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}` : `✗ Window CLOSED — ended ${end.toLocaleDateString("en-KE", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}` });
        })(),
        !windowStart && !windowLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground", children: "No window set — the bursary form is currently hidden from all users." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => {
          setDraftWindowStart("");
          saveWindow("");
        }, disabled: savingWindow || !windowStart, children: "Clear / Close window immediately" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-4 bg-card border border-border rounded-2xl p-4 shadow-elegant flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: dirty ? "You have unsaved changes." : "All changes saved." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: reset, disabled: !dirty, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-4 w-4" }),
            " Discard"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "hero", onClick: save, disabled: !dirty, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            " Save changes"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Section({
  title,
  icon: Icon,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-bold flex items-center gap-2 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
      " ",
      title
    ] }),
    children
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-semibold text-sm mb-1.5 block", children: label }),
    children
  ] });
}
export {
  AdminContentPage as component
};
