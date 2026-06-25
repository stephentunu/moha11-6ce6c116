import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLanguage, c as cn } from "./router-CiepFxU2.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { u as useContent } from "./admin-store-Pu01Ao05.mjs";
import { h as healthImg } from "./moha10-kn_rQRPB.mjs";
import { b as businessImg } from "./foundation5-KNE-pZVQ.mjs";
import { e as environmentImg } from "./moha16-Szzu4Iq9.mjs";
import { g as galleryImg2 } from "./donation3-A-vImyKs.mjs";
import { G as GraduationCap, H as HeartPulse, B as Briefcase, g as ShieldCheck, i as HeartHandshake, j as CircleCheck, k as Clock, T as TriangleAlert, R as Rocket } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
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
const educationImg = "/assets/moha25-BRSpTG0R.jpeg";
const themes = [{
  key: "education",
  icon: GraduationCap,
  title: "Education",
  tagline: "Every child reads. Every dream is funded.",
  img: educationImg,
  color: "from-blue-600/80 to-primary/90",
  challenges: ["Fee challenges", "Undeveloped infrastructure", "Inadequate digital penetration/ICT", "Shortage of teachers", "Few public schools", "High dropout rates", "Unsafe learning environment", "Inadequate food/malnutrition", "Severe Overcrowding in classes"],
  initiatives: ["600+ bursaries issued to needy students", "Over 60 students fully sponsored", "Food donation to needy households", "Feeding program to school children", "Empowerment programs to parents and guardians to get income", "Tuition organized for pre-primary, junior and senior students", "Sanitary pads/towels to girls", "Legal education to parents and guardians", "Back to school sports tournaments", "Distribution of stationeries/books to students", "Bought and distributed uniforms and boarding items to needy students"],
  future: ["Add more bursary allocation to all wards", "Build more schools and upgrade the current ones", "Establish digital learning centers in each ward", "Source for more teachers from TSC", "Clear drainage and enhance security near learning centers", "Enhance school feeding programs"]
}, {
  key: "health",
  icon: HeartPulse,
  title: "Health & Environment",
  tagline: "Clean Mathare. Healthy Mathare. Dignified care.",
  img: healthImg,
  color: "from-emerald-600/80 to-primary/90",
  challenges: ["Poor waste management", "Flooding", "poor planning", "Water and air polution", "Waterbone and respiratory diseases", "poor sanitation", "Mental health and drug abuse"],
  initiatives: ["Food distribution to needy households to improve nutrition", "cleaning exercise done in each ward", "Water distribution during scarcity", "SHA registration and payments to needy families and empowerments of youths to shurn drug abuse and violence", "Sanitary towels/pads to girls", "distribution of wheelchairs and other essential ammenities to the PWDs", "distribution of essentials to families affected by floods", "Support for people living with chronic illnesses"],
  future: ["Liase with County Government to push for cleaning programs of Mathare and the rivers", "Empower CBOs and individuals in waste managementand disposal", "Open drainage systems and build more roads to estates and houses", "Establish Mental health and drug abuse rehabilitation centers in Mathare", "Register more households/families to SHA and other insuarances", "To push the County and National Govenments to order for proper planning to mitigate against floods"]
}, {
  key: "businesses",
  icon: Briefcase,
  title: "Businesses",
  tagline: "Hustle protected. Capital unlocked.",
  img: businessImg,
  color: "from-amber-600/80 to-primary/90",
  challenges: ["Finacial constraints and credit accessibility", "poor infrastructure and utilities", "Insecurity and Safety of businesses", "Inadequate business support and education", "Low purchasing power and crowded markets"],
  initiatives: ["Fundraising in aid of businesses, groups and individuals", "Empowerment of programs to women, youth and entrepreneurs", "Buying handcarts to groups and youths", "Donating of chair and tents to groups", "Construction of bodaboda tents/shede", "Buying TV sets and DStv to youth groups", "Providing raincoats to businesses", "Buying water tanks and car wash machines to youth groups", "Equiping barber and salon shops", "Buying boxing equipment and materials to youth groups", "Providing umbrellas to businesses", "Building stocks for businesses e.g omena and eggs"],
  future: ["Expand financial inclusion and source for more funds from reliable partners", "Improve the drainage, streets, lighting, roads accessibility and expand more market stalls", "Enhance security by collaborating with National Govenment to build more police posts and add more security personnel", "Organize business training and education to established and upcoming entrepreneurs", "Create more empowerment programs to improve the purchasing power."]
}, {
  key: "security",
  icon: ShieldCheck,
  title: "Security & Safety",
  tagline: "Safer streets. Lit estates. Protected families.",
  img: environmentImg,
  color: "from-rose-600/80 to-primary/90",
  challenges: ["Violence, crime and gang activities", "GBV and rape", "Unemployment and poverty", "poor infrastructure", "Environmental and structural hazards", "police-community tensions"],
  initiatives: ["Funding High school education to minimize dropouts rates", "Food distribution and feeding programs against poverty issues", "Empowerment through Moha's Biz Mtaani programs that addresses unemployment, poverty and crime", "Mentorship programs to avoid idleness and back to school sport tournaments ", "legal aid on GBV and Funding lawyers to follow family cases"],
  future: ["Empower and fund reformed drug addicts and criminals", "Collaborate with CBOs, NGOs and National Govenment on GBV and rape cases", "Initiate more economic and social empowerment programs to tackle unemployment and poverty", "Build more access roads, street light installation and open up remote areas", "Initiate closer police-community partnership"]
}, {
  key: "other",
  icon: HeartHandshake,
  title: "Other Initiatives",
  tagline: "Leaving no one behind. Support that reaches every corner.",
  img: galleryImg2,
  color: "from-violet-600/80 to-primary/90",
  challenges: ["Vulnerable groups without targeted support", "Food insecurity in households", "Limited access to health insurance registration", "PWDs lack assistive devices and essential amenities"],
  initiatives: ["Support to the vulnerable groups", "Food distribution", "SHA registration", "Free assistive devices"],
  future: ["Recruitment and industrial attachment opportunities", "Overseas and International Scholarship"]
}];
function PrioritiesPage() {
  const [active, setActive] = reactExports.useState(themes[0].key);
  const current = themes.find((t2) => t2.key === active);
  const [content] = useContent();
  const {
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("The Manifesto"), title: t(content.prioritiesHeadline), subtitle: t(content.prioritiesSubtitle), bgImage: educationImg }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 justify-center mb-12", children: themes.map((theme) => {
        const isActive = active === theme.key;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(theme.key), className: cn("flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all border-2", isActive ? "bg-primary text-primary-foreground border-primary shadow-elegant" : "bg-card text-foreground border-border hover:border-primary/50"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(theme.icon, { className: "h-4 w-4" }),
          t(theme.title)
        ] }, theme.key);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, exit: {
        opacity: 0,
        y: -20
      }, transition: {
        duration: 0.4
      }, className: "space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-3xl overflow-hidden min-h-[320px] shadow-elegant", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: current.img, alt: current.title, loading: "lazy", className: "w-full h-full object-cover absolute inset-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("absolute inset-0 bg-gradient-to-br", current.color) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-10 h-full flex flex-col justify-end text-white min-h-[320px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(current.icon, { className: "h-14 w-14 text-gold mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl md:text-5xl font-display font-black", children: t(current.title) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-lg text-white/90 italic", children: t(current.tagline) })
          ] })
        ] }),
        current.key === "other" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PillarColumn, { icon: CircleCheck, iconClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30", title: "Initiatives", subtitle: "Support programs already running", items: current.initiatives }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PillarColumn, { icon: Clock, iconClass: "text-violet-600 bg-violet-100 dark:bg-violet-900/30", title: "Coming Soon", subtitle: "New opportunities on the way", items: current.future })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PillarColumn, { icon: TriangleAlert, iconClass: "text-rose-600 bg-rose-100 dark:bg-rose-900/30", title: "Challenges", subtitle: "What Mathare faces today", items: current.challenges }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PillarColumn, { icon: CircleCheck, iconClass: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30", title: "Initiatives", subtitle: "What Moha is already delivering", items: current.initiatives }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PillarColumn, { icon: Rocket, iconClass: "text-amber-600 bg-amber-100 dark:bg-amber-900/30", title: "Future Plans", subtitle: "What we will deliver next", items: current.future })
        ] })
      ] }, current.key) })
    ] }) })
  ] });
}
function PillarColumn({
  icon: Icon,
  iconClass,
  title,
  subtitle,
  items
}) {
  const {
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-3xl p-7 border border-border shadow-elegant h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-10 w-10 rounded-xl flex items-center justify-center", iconClass), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-lg leading-tight", children: t(title) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t(subtitle) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-3", children: items.map((item, i) => {
      const translated = t(item);
      const display = translated.length ? translated[0].toUpperCase() + translated.slice(1) : translated;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.li, { initial: {
        opacity: 0,
        x: -8
      }, animate: {
        opacity: 1,
        x: 0
      }, transition: {
        delay: i * 0.04
      }, className: "flex items-start gap-2 text-sm text-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-2 flex-shrink-0 h-1.5 w-1.5 rounded-full bg-gold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: display })
      ] }, item);
    }) })
  ] });
}
export {
  PrioritiesPage as component
};
