import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { u as useLanguage, B as Button, c as cn } from "./router-CXbsBUWo.mjs";
import { I as Input } from "./input-DKkwU37r.mjs";
import { L as Label } from "./label-CJiRYFTX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { g as galleryImg2 } from "./donation3-A-vImyKs.mjs";
import { r as rallyImg } from "./foundation1-BGwft8W6.mjs";
import { g as galleryImg4 } from "./bursary1-CRj1RPxJ.mjs";
import { b as businessImg } from "./foundation5-KNE-pZVQ.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { j as CircleCheck, z as Smartphone, E as CreditCard, d as LoaderCircle, F as Heart, J as Shield } from "../_libs/lucide-react.mjs";
import { s as stringType } from "../_libs/zod.mjs";
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
const tiers = [500, 1e3, 2500, 5e3, 1e4];
const phoneSchema = stringType().trim().regex(/^(?:\+?254|0)?(7\d{8}|1\d{8})$/, "Enter a valid Kenyan phone number");
function DonatePage() {
  const [method, setMethod] = reactExports.useState("mpesa");
  const [amount, setAmount] = reactExports.useState(1e3);
  const [custom, setCustom] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("idle");
  const {
    t
  } = useLanguage();
  const finalAmount = custom ? Number(custom) : amount;
  const handleMpesa = (e) => {
    e.preventDefault();
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum donation is KSh 10");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      toast.success(`STK Push sent to ${phone}. Enter your M-Pesa PIN.`);
    }, 2200);
  };
  const handleCard = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!finalAmount || finalAmount < 10) {
      toast.error("Minimum donation is KSh 10");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      toast.success("Card payment confirmation sent to your email.");
    }, 1800);
  };
  if (status === "success") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Asante Sana"), title: t("You powered the movement") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-xl text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
          scale: 0.5,
          opacity: 0
        }, animate: {
          scale: 1,
          opacity: 1
        }, transition: {
          type: "spring"
        }, className: "mx-auto h-24 w-24 rounded-full bg-gold flex items-center justify-center shadow-gold mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-gold-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold", children: t("Asante kwa kuwa pamoja nasi!") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-muted-foreground text-lg", children: [
          t("Your contribution of"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-primary", children: [
            "KSh ",
            finalAmount.toLocaleString()
          ] }),
          " ",
          t("is fueling real change in Mathare. We'll send a receipt shortly.")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", size: "lg", className: "mt-8", onClick: () => {
          setStatus("idle");
          setPhone("");
          setName("");
        }, children: t("Donate Again") })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Power the Movement"), title: t("Every shilling delivers."), subtitle: t("From KSh 500 to KSh 10,000 — your donation funds bursaries, clinics, clean-ups, and youth programs across Mathare.") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8 max-w-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl p-6 md:p-10 border border-border shadow-elegant", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMethod("mpesa"), className: cn("flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all", method === "mpesa" ? "bg-card text-primary shadow-elegant" : "text-muted-foreground hover:text-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" }),
          "M-PESA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMethod("card"), className: cn("flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all", method === "card" ? "bg-card text-primary shadow-elegant" : "text-muted-foreground hover:text-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4" }),
          "Card"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-foreground mb-3 block", children: t("Choose an amount (KSh)") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 sm:grid-cols-5 gap-2", children: tiers.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setAmount(t2);
          setCustom("");
        }, className: cn("py-4 rounded-xl font-bold transition-all border-2", amount === t2 && !custom ? "bg-gradient-gold text-gold-foreground border-gold shadow-gold" : "bg-card text-foreground border-border hover:border-primary"), children: t2.toLocaleString() }, t2)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: t("Or enter custom amount"), value: custom, min: 10, max: 5e6, onChange: (e) => setCustom(e.target.value), className: "h-12" }) })
      ] }),
      method === "mpesa" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleMpesa, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "text-sm font-bold mb-2 block", children: t("M-Pesa Phone Number") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", placeholder: "07XX XXX XXX", value: phone, onChange: (e) => setPhone(e.target.value), maxLength: 15, className: "h-12 text-lg", required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: t("You will receive an STK Push prompt to confirm.") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground mb-1", children: t("Or use Paybill manually:") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
            "Paybill:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: "247247" }),
            " • Account:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: "MOHA2027" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "xl", className: "w-full", disabled: status === "loading", children: status === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
          " ",
          t("Sending STK Push…")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5" }),
          " ",
          t("Support Moha"),
          " — KSh",
          " ",
          finalAmount.toLocaleString()
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCard, className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "text-sm font-bold mb-2 block", children: t("Cardholder Name") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name", placeholder: t("Full name on card"), value: name, onChange: (e) => setName(e.target.value), maxLength: 100, className: "h-12", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card", className: "text-sm font-bold mb-2 block", children: t("Card Number") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "card", placeholder: "1234 5678 9012 3456", maxLength: 19, className: "h-12 font-mono", required: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "exp", className: "text-sm font-bold mb-2 block", children: t("Expiry") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "exp", placeholder: "MM/YY", maxLength: 5, className: "h-12 font-mono", required: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cvv", className: "text-sm font-bold mb-2 block", children: "CVV" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "cvv", placeholder: "123", maxLength: 4, className: "h-12 font-mono", required: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", variant: "hero", size: "xl", className: "w-full", disabled: status === "loading", children: status === "loading" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
          " ",
          t("Processing…")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-5 w-5" }),
          " ",
          t("Donate KSh"),
          " ",
          finalAmount.toLocaleString()
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-xs text-center text-muted-foreground flex items-center justify-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
        " ",
        t("Secure payment. Your information is never shared.")
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-6xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full", children: t("Your Impact") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-5xl font-display font-bold text-foreground text-balance", children: t("Where every shilling goes") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground max-w-2xl mx-auto", children: t("From food parcels to bursaries to clean water tanks — your donation funds the work that's already happening, every single week, on the streets of Mathare.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [{
        img: galleryImg2,
        label: "Food & relief drives"
      }, {
        img: rallyImg,
        label: "Clean water tanks"
      }, {
        img: galleryImg4,
        label: "Student bursaries"
      }, {
        img: businessImg,
        label: "Hustler tools & capital"
      }].map((item, i) => (
        // labels are passed through t() below
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          delay: i * 0.08
        }, className: "group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-elegant", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.img, alt: item.label, loading: "lazy", className: "absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 p-4 text-primary-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-sm md:text-base", children: t(item.label) }) })
        ] }, item.label)
      )) })
    ] }) })
  ] });
}
export {
  DonatePage as component
};
