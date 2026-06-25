import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLanguage, c as cn, B as Button } from "./router-CXbsBUWo.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { C as Checkbox } from "./checkbox-5WWmtZFV.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bbw65E3G.mjs";
import { R as Root, C as CollapsibleTrigger$1, a as CollapsibleContent$1 } from "../_libs/radix-ui__react-collapsible.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { T as Toaster } from "./sonner-DeNSN9-c.mjs";
import { b as usePolls, M as MATHARE_WARDS, v as votePoll } from "./admin-store-Pu01Ao05.mjs";
import { a as MapPin, l as Star, V as Vote, m as TrendingUp, j as CircleCheck, C as ChevronDown } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/zod.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "./client-r8zzNwlx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const Collapsible = Root;
const CollapsibleTrigger = CollapsibleTrigger$1;
const CollapsibleContent = CollapsibleContent$1;
const RATING_OPTIONS = [{
  id: "best",
  label: "Best",
  color: "text-emerald-600",
  bg: "bg-emerald-50",
  border: "border-emerald-400"
}, {
  id: "fair",
  label: "Fairly",
  color: "text-amber-600",
  bg: "bg-amber-50",
  border: "border-amber-400"
}, {
  id: "worst",
  label: "Worst",
  color: "text-rose-600",
  bg: "bg-rose-50",
  border: "border-rose-400"
}];
function isServicePoll(p) {
  return p.id.startsWith("p_svc_");
}
function serviceNameFromQuestion(q) {
  const m = q.match(/delivery on (.+)\?/i);
  return m ? m[1].trim() : q;
}
function PollingPage() {
  const [polls] = usePolls();
  const [ward, setWard] = reactExports.useState("");
  const [voted, setVoted] = reactExports.useState({});
  const [phone, setPhone] = reactExports.useState("");
  const [smsSent, setSmsSent] = reactExports.useState(false);
  const [sendingSms, setSendingSms] = reactExports.useState(false);
  const {
    language,
    t
  } = useLanguage();
  const totalVotes = Object.keys(voted).length;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://mohadelivers.com";
  const sendThankYouSms = async () => {
    const cleaned = phone.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");
    if (!/^254[17]\d{8}$/.test(cleaned)) {
      toast.error(t("Please enter a valid Kenyan mobile number (07XX or 01XX)"));
      return;
    }
    setSendingSms(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSendingSms(false);
    setSmsSent(true);
    toast.success(t("Thank-you message sent to your number!"));
  };
  const {
    servicePolls,
    otherPolls
  } = reactExports.useMemo(() => {
    const servicePolls2 = polls.filter(isServicePoll);
    const otherPolls2 = polls.filter((p) => !isServicePoll(p));
    return {
      servicePolls: servicePolls2,
      otherPolls: otherPolls2
    };
  }, [polls]);
  const handleVote = (pollId, optionId) => {
    if (!ward) {
      toast.error(t("Please select your ward before voting."));
      return;
    }
    if (voted[pollId]) {
      toast.info(t("You've already rated this service."));
      return;
    }
    votePoll(pollId, optionId, ward);
    setVoted((v) => ({
      ...v,
      [pollId]: optionId
    }));
    toast.success(t("Asante! Your vote from {ward} ward has been recorded.").replace("{ward}", ward));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Your Voice"), title: t("Vote on what matters"), subtitle: t("Pick your Mathare ward, then tell Moha where you stand. Every vote shapes the action plan.") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-12 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8 max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-2 border-primary/20 rounded-2xl p-5 md:p-6 mb-8 shadow-elegant", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5 text-gold" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base md:text-lg font-display font-bold text-foreground", children: t("Step 1 — Select your ward") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 mb-3", children: t("We use this only to break results down by ward. One vote per question per device.") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: ward, onValueChange: setWard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full md:max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: t("Choose your Mathare ward") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MATHARE_WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: t(w) }, w)) })
          ] }),
          ward && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs font-semibold text-gold", children: [
            "✓ ",
            t("Voting as a resident of"),
            " ",
            ward,
            " ",
            t("ward")
          ] })
        ] })
      ] }) }),
      servicePolls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 md:p-6 mb-8 shadow-elegant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg md:text-xl font-display font-bold text-foreground", children: t("Rate how the following services are offered in Mathare by the Government and people's Representatives") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: t("Click a rating, then tick the services it applies to. One vote per service per device.") })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: RATING_OPTIONS.map((rating) => /* @__PURE__ */ jsxRuntimeExports.jsx(RatingAccordion, { rating, polls: servicePolls, voted, ward, onVote: handleVote }, rating.id)) }),
        !ward && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground text-center", children: t("↑ Select your ward above to unlock voting.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: otherPolls.map((poll, i) => {
        const userVote = voted[poll.id];
        const locked = !ward;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true
        }, transition: {
          duration: 0.4,
          delay: i * 0.05
        }, className: "bg-card border border-border rounded-2xl p-5 md:p-6 shadow-elegant", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base md:text-lg font-display font-bold text-foreground text-balance", children: t(poll.question) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
                t("Results are kept private and shared with Moha's team only.")
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: poll.options.map((opt) => {
            const isUserChoice = userVote === opt.id;
            const voteCast = !!userVote;
            const disabled = locked || voteCast;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleVote(poll.id, opt.id), disabled, className: cn("w-full text-left rounded-xl border-2 transition-all px-4 py-3 flex items-center justify-between gap-3", disabled && !isUserChoice ? "border-border cursor-not-allowed opacity-60" : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer", isUserChoice && "border-gold bg-gold/5 opacity-100"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 font-semibold text-foreground text-sm", children: [
              isUserChoice && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-gold" }),
              t(opt.label)
            ] }) }, opt.id);
          }) }),
          userVote ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs font-semibold text-gold", children: [
            "✓ ",
            t("Asante! Your vote from {ward} ward has been recorded.").replace("{ward}", ward)
          ] }) : locked ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-muted-foreground", children: t("Select your ward above to unlock voting.") }) : null
        ] }, poll.id);
      }) }),
      totalVotes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 bg-card border-2 border-gold/30 rounded-2xl p-5 md:p-6 shadow-elegant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gold/15 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Vote, { className: "h-5 w-5 text-gold" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base md:text-lg font-display font-bold text-foreground", children: t("Asante sana for voting! 🙏") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: t("Enter your mobile number to receive a thank-you message with a link you can share with friends.") })
          ] })
        ] }),
        smsSent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-8 w-8 text-emerald-600 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-emerald-700", children: t("Message sent to {phone}!").replace("{phone}", phone) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-600", children: t("Share the link with your friends so they can also have their say.") })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium", children: "🇰🇪" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "tel", placeholder: "07XX XXX XXX", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full pl-9 pr-3 h-10 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", onClick: sendThankYouSms, disabled: sendingSms || !phone.trim(), className: "shrink-0", children: sendingSms ? t("Sending…") : t("Send SMS") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
            t("The SMS will include a link to"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: siteUrl }),
            " ",
            t("that you can forward to friends and family. Standard Safaricom / Airtel rates may apply.")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "hero", size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/opinion", children: t("Have a different idea? Send a message") }) }) })
    ] }) })
  ] });
}
function RatingAccordion({
  rating,
  polls,
  voted,
  ward,
  onVote
}) {
  const [open, setOpen] = reactExports.useState(false);
  const locked = !ward;
  const countVoted = polls.filter((p) => voted[p.id] === rating.id).length;
  const {
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Collapsible, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CollapsibleTrigger, { className: cn("w-full flex flex-col items-center justify-center gap-1.5 px-3 py-4 rounded-xl border-2 transition-all", "border-border hover:bg-muted/40", open && rating.border, open && rating.bg), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-base md:text-lg font-display font-bold", rating.color), children: t(rating.label) }),
      countVoted > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full", rating.bg, rating.color), children: [
        countVoted,
        " ",
        t("voted")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CollapsibleContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-xl border border-border overflow-hidden", children: [
      locked && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 py-3 text-xs text-muted-foreground", children: t("Select your ward above to unlock voting.") }),
      polls.map((p) => {
        const userVote = voted[p.id];
        const votedThisRating = userVote === rating.id;
        const votedOtherRating = !!userVote && userVote !== rating.id;
        const service = serviceNameFromQuestion(p.question);
        const disabled = locked || votedOtherRating;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cn("flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 transition-colors", disabled ? "opacity-50 cursor-not-allowed bg-muted/20" : votedThisRating ? cn("cursor-default", rating.bg) : "cursor-pointer hover:bg-muted/30"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: votedThisRating, onCheckedChange: () => {
            if (!disabled && !userVote) onVote(p.id, rating.id);
          }, disabled: disabled || !!userVote, className: cn(rating.id === "best" ? "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" : rating.id === "fair" ? "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500" : "data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground leading-tight flex-1", children: t(service) }),
          votedThisRating && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: cn("h-4 w-4 shrink-0", rating.color) }),
          votedOtherRating && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase shrink-0", children: [
            t("Rated"),
            " ",
            t(RATING_OPTIONS.find((r) => r.id === userVote)?.label || "")
          ] })
        ] }, p.id);
      })
    ] }) })
  ] });
}
export {
  PollingPage as component
};
