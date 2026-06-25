import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { h as heroImg, u as useLanguage, B as Button, c as cn } from "./router-CiepFxU2.mjs";
import { u as useContent, g as useActivities, h as filterUpcoming } from "./admin-store-Pu01Ao05.mjs";
import { r as rallyImg } from "./foundation1-BGwft8W6.mjs";
import { h as healthImg } from "./moha10-kn_rQRPB.mjs";
import { b as businessImg } from "./foundation5-KNE-pZVQ.mjs";
import { e as environmentImg } from "./moha16-Szzu4Iq9.mjs";
import { g as galleryImg2 } from "./donation3-A-vImyKs.mjs";
import { a as galleryImg3, g as galleryImg5 } from "./moha40-DvwP6k7A.mjs";
import { g as galleryImg4 } from "./bursary1-CRj1RPxJ.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { S as Sparkles, q as ArrowRight, p as Calendar, k as Clock, a as MapPin, G as GraduationCap, H as HeartPulse, B as Briefcase, g as ShieldCheck, Q as Quote, w as Users } from "../_libs/lucide-react.mjs";
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
function SectionHeader({ eyebrow, title, subtitle, align = "center", className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 24 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.6, ease: "easeOut" },
      className: cn(
        "max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      ),
      children: [
        eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20", children: eyebrow }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl md:text-5xl lg:text-6xl font-display font-bold text-balance text-foreground", children: title }),
        subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-muted-foreground leading-relaxed text-balance", children: subtitle })
      ]
    }
  );
}
const educationImg = "/assets/moha35-DMZKVY00.jpeg";
const galleryImg1 = "/assets/moha1-kazfKmYo.jpeg";
const galleryImg6 = "/assets/moha20-BLgVc7NV.jpeg";
const priorities = [{
  icon: GraduationCap,
  title: "Education",
  img: educationImg,
  desc: "Bursaries, sponsorships & digital learning for every Mathare child.",
  to: "/priorities"
}, {
  icon: HeartPulse,
  title: "Health & Environment",
  img: healthImg,
  desc: "SHA registration, clean rivers, dignified care close to home.",
  to: "/priorities"
}, {
  icon: Briefcase,
  title: "Businesses",
  img: businessImg,
  desc: "Capital, infrastructure & security for hustlers and mama mbogas.",
  to: "/priorities"
}, {
  icon: ShieldCheck,
  title: "Security & Safety",
  img: environmentImg,
  desc: "Safer streets, lit estates, and protection for every household.",
  to: "/priorities"
}];
const stats = [{
  value: "600+",
  label: "Bursaries Issued"
}, {
  value: "85+",
  label: "Community Projects"
}, {
  value: "30K+",
  label: "Lives Touched"
}, {
  value: "100%",
  label: "Mathare First"
}];
function HomePage() {
  const [content] = useContent();
  const [activitiesAll] = useActivities();
  const upcoming = filterUpcoming(activitiesAll).slice(0, 6);
  const hero = content.heroImageUrl || heroImg;
  const {
    language,
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-[60vh] flex items-center overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: hero, alt: "Moha standing tall in Mathare at golden hour", className: "w-full h-full object-cover object-top md:object-[center_top]", width: 1600, height: 1200 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-hero" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8 relative z-10 pt-16 pb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.span, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, className: "inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-bold tracking-widest uppercase text-gold bg-gold/10 backdrop-blur-md rounded-full border border-gold/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" }),
          t("Mathare MP Aspirant • 2027")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7,
          delay: 0.1
        }, className: "text-4xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[0.95] text-balance", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent", children: t(content.homeHeadline) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.p, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7,
          delay: 0.25
        }, className: "mt-4 text-xl md:text-2xl font-display italic text-gold", children: [
          '"',
          t(content.homeTagline),
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.p, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7,
          delay: 0.4
        }, className: "mt-4 text-base md:text-lg text-white/85 max-w-2xl leading-relaxed", children: [
          t("A son of Mathare. A voice for the hustler, the student, the mama, and the mzee."),
          " ",
          t("Building a constituency where every life matters and every dream has a runway.")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 30
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.7,
          delay: 0.55
        }, className: "mt-8 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "hero", size: "xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/donate", children: [
            t("Support the Movement"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "xl", className: "bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/priorities", children: t("Read the Manifesto") }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { animate: {
        y: [0, 8, 0]
      }, transition: {
        duration: 2,
        repeat: Infinity
      }, className: "absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs font-semibold tracking-widest uppercase", children: t("Scroll") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-14 bg-gradient-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-8 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full border border-primary/20", children: t("Today & Tomorrow") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold text-foreground text-balance", children: t("Daily Campaign Activities") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: t("Where Moha and the team will be on the ground. Activities disappear automatically after the event date.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-8", children: upcoming.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-8 shadow-elegant text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-8 w-8 text-primary mx-auto mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold", children: t("No public activities scheduled right now") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground text-sm", children: t("Check back soon — we update this calendar daily.") })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: upcoming.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
        opacity: 0,
        y: 20
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true,
        margin: "-50px"
      }, transition: {
        delay: i * 0.05,
        duration: 0.4
      }, className: "bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-elegant hover:-translate-y-0.5 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-primary mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
          new Date(a.date).toLocaleDateString(language === "sw" ? "sw-KE" : "en-KE", {
            weekday: "short",
            day: "numeric",
            month: "short"
          }),
          a.time && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 ml-1" }),
            a.time
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-base font-bold text-foreground", children: a.title }),
        a.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2", children: a.description }),
        (a.location || a.ward) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-foreground/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-gold" }),
          [a.location, a.ward].filter(Boolean).join(" • ")
        ] })
      ] }, a.id)) }) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-primary text-primary-foreground py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: stats.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true
    }, transition: {
      delay: i * 0.08
    }, className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl md:text-5xl font-display font-black text-gold", children: s.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs md:text-sm font-semibold tracking-wide uppercase text-primary-foreground/70", children: t(s.label) })
    ] }, s.label)) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: t("Our Four Pillars"), title: t("What Moha is delivering"), subtitle: t("A focused, people-first plan grounded in the realities of Mathare — built with the community, for the community.") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-4", children: priorities.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
        opacity: 0,
        y: 30
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true,
        margin: "-50px"
      }, transition: {
        duration: 0.5,
        delay: i * 0.1
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: p.to, className: "group block h-full rounded-2xl overflow-hidden bg-card border border-border shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-48 overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.img, alt: t(p.title), loading: "lazy", width: 1200, height: 800, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-gold flex items-center justify-center shadow-gold", children: /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: "h-6 w-6 text-gold-foreground" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors", children: t(p.title) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: t(p.desc) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all", children: [
            t("Explore"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }) }, p.title)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-24 bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { eyebrow: t("On the Ground"), title: t("Real work. Real Mathare."), subtitle: t("Snapshots from bursary drives, water donations, school visits, and community days — the work that doesn't wait for elections.") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6", children: [galleryImg1, galleryImg2, galleryImg3, galleryImg4, galleryImg5, galleryImg6].map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        scale: 0.95
      }, whileInView: {
        opacity: 1,
        scale: 1
      }, viewport: {
        once: true,
        margin: "-50px"
      }, transition: {
        duration: 0.5,
        delay: i * 0.06
      }, className: `group relative overflow-hidden rounded-2xl shadow-elegant ${i === 0 || i === 4 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-square"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img, alt: "Moha in the community", loading: "lazy", className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" })
      ] }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative py-32 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: rallyImg, alt: "Mathare supporters at a rally", loading: "lazy", width: 1600, height: 900, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
        opacity: 0,
        x: -30
      }, whileInView: {
        opacity: 1,
        x: 0
      }, viewport: {
        once: true
      }, transition: {
        duration: 0.7
      }, className: "max-w-2xl text-primary-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "h-12 w-12 text-gold mb-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-3xl md:text-4xl font-display font-bold leading-tight text-balance", children: [
          '"',
          t(content.homeQuote),
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-sm font-semibold tracking-widest uppercase text-gold", children: [
          "— ",
          t(content.homeQuoteAuthor)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "hero", size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/foundations", children: [
            t("Meet the Foundation"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", className: "bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/polling", children: t("Vote on the Issues") }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-gradient-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-8 max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/ask", className: "group p-8 rounded-2xl bg-card border border-border hover:border-primary shadow-elegant hover:shadow-glow transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-10 w-10 text-gold mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold", children: t("Ask Moha") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: t("Your questions deserve answers. Send a question directly to Moha.") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all", children: [
          t("Ask now"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/opinion", className: "group p-8 rounded-2xl bg-card border border-border hover:border-primary shadow-elegant hover:shadow-glow transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-accent mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-display font-bold", children: t("Share Your Opinion") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: t("Tell us what Mathare needs. Every voice shapes the manifesto.") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mt-4 inline-flex items-center gap-1 font-semibold text-primary group-hover:gap-2 transition-all", children: [
          t("Send a message"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  HomePage as component
};
