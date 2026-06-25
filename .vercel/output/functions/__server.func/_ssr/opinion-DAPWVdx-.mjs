import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLanguage, B as Button } from "./router-CXbsBUWo.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { I as Input } from "./input-DKkwU37r.mjs";
import { L as Label } from "./label-CJiRYFTX.mjs";
import { T as Textarea } from "./textarea-PZUwCibH.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { c as addMessage } from "./admin-store-Pu01Ao05.mjs";
import { d as LoaderCircle, e as Send } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const schema = objectType({
  name: stringType().trim().min(2, "Name is too short").max(100),
  ward: stringType().trim().min(2, "Tell us your ward").max(60),
  message: stringType().trim().min(10, "Share a bit more").max(1e3)
});
function OpinionPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [data, setData] = reactExports.useState({
    name: "",
    ward: "",
    message: ""
  });
  const {
    t
  } = useLanguage();
  const submit = (e) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      toast.error(t(result.error.issues[0].message));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      addMessage({
        kind: "opinion",
        name: data.name,
        contact: data.ward,
        body: data.message
      });
      setLoading(false);
      toast.success(t("Asante! Your message has reached Moha's team."));
      setData({
        name: "",
        ward: "",
        message: ""
      });
    }, 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Speak Up"), title: t("Your message. Real action."), subtitle: t("Tell us what Mathare needs — ideas, complaints, suggestions, encouragement. Moha's team reads every single message.") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "bg-card border border-border rounded-3xl p-6 md:p-10 shadow-elegant space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "font-bold mb-2 block", children: t("Your Name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: t("Enter your name..."), value: data.name, maxLength: 100, onChange: (e) => setData((d) => ({
            ...d,
            name: e.target.value
          })), className: "h-12", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ward", className: "font-bold mb-2 block", children: t("Ward / Estate") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ward", placeholder: t("e.g. Mlango Kubwa"), value: data.ward, maxLength: 60, onChange: (e) => setData((d) => ({
            ...d,
            ward: e.target.value
          })), className: "h-12", required: true })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "message", className: "font-bold mb-2 block", children: t("Your Message") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "message", placeholder: t("Tell Moha what's on your mind…"), value: data.message, maxLength: 1e3, onChange: (e) => setData((d) => ({
          ...d,
          message: e.target.value
        })), className: "min-h-[160px] resize-y", required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground text-right", children: [
          data.message.length,
          "/1000"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
        " ",
        t("Sending…")
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5" }),
        " ",
        t("Send to Moha")
      ] }) })
    ] }) }) })
  ] });
}
export {
  OpinionPage as component
};
