import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLanguage, B as Button } from "./router-CiepFxU2.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { I as Input } from "./input-CYFYh61W.mjs";
import { L as Label } from "./label-CrVjKyup.mjs";
import { T as Textarea } from "./textarea-DKi4YOWV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { c as addMessage } from "./admin-store-Pu01Ao05.mjs";
import { d as LoaderCircle, e as Send, K as MessageCircleQuestionMark } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
  name: stringType().trim().min(2).max(100),
  contact: stringType().trim().min(5, "Phone or email required").max(120),
  question: stringType().trim().min(10, "Ask a real question").max(800)
});
const popularQs = ["What's your plan for youth unemployment?", "How will you handle insecurity in Mathare?", "Where can I find your full manifesto?", "How do I volunteer for the campaign?", "What is the bursary application process?"];
function AskPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [data, setData] = reactExports.useState({
    name: "",
    contact: "",
    question: ""
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
        kind: "ask",
        name: data.name,
        contact: data.contact,
        body: data.question
      });
      setLoading(false);
      toast.success(t("Question received! Moha or his team will get back to you."));
      setData({
        name: "",
        contact: "",
        question: ""
      });
    }, 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Direct Line"), title: t("Ask Moha anything."), subtitle: t("No filters. No PR speak. Submit your question and get a real answer from Moha or his team.") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "lg:col-span-3 bg-card border border-border rounded-3xl p-6 md:p-8 shadow-elegant space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "font-bold mb-2 block", children: t("Your Name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: t("Enter your name..."), value: data.name, maxLength: 100, onChange: (e) => setData((d) => ({
            ...d,
            name: e.target.value
          })), className: "h-12", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contact", className: "font-bold mb-2 block", children: t("Phone or Email") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "contact", placeholder: t("07XX or you@email.com"), value: data.contact, maxLength: 120, onChange: (e) => setData((d) => ({
            ...d,
            contact: e.target.value
          })), className: "h-12", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "question", className: "font-bold mb-2 block", children: t("Your Question") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "question", placeholder: t("Ask Moha…"), value: data.question, maxLength: 800, onChange: (e) => setData((d) => ({
            ...d,
            question: e.target.value
          })), className: "min-h-[140px]", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "lg", className: "w-full", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
          " ",
          t("Submitting...")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5" }),
          " ",
          t("Ask Moha")
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-bold text-lg mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircleQuestionMark, { className: "h-5 w-5 text-gold" }),
          t("Popular questions")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: popularQs.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.li, { initial: {
          opacity: 0,
          x: 10
        }, whileInView: {
          opacity: 1,
          x: 0
        }, transition: {
          delay: i * 0.05
        }, viewport: {
          once: true
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setData((d) => ({
          ...d,
          question: q
        })), className: "w-full text-left p-4 rounded-xl bg-card border border-border hover:border-primary hover:bg-primary/5 transition text-sm text-foreground", children: t(q) }) }, q)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-xs text-muted-foreground", children: t("Tip: try the floating chat (bottom-right) for instant manifesto answers from Moha's AI.") })
      ] }) })
    ] }) }) })
  ] });
}
export {
  AskPage as component
};
