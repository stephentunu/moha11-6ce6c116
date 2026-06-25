import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { u as useLanguage } from "./router-CXbsBUWo.mjs";
import { r as rallyImg } from "./foundation1-BGwft8W6.mjs";
import { g as galleryImg4 } from "./bursary1-CRj1RPxJ.mjs";
import { h as healthImg } from "./moha10-kn_rQRPB.mjs";
import { b as businessImg } from "./foundation5-KNE-pZVQ.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { p as Calendar, q as ArrowRight } from "../_libs/lucide-react.mjs";
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
const environmentImg = "/assets/environment-cleanup-J91LJtMB.jpg";
const news = [{
  img: rallyImg,
  tag: "Movement",
  date: "Apr 18, 2026",
  title: "Moha Campaign: Mathare rallies behind Moha at Huruma Grounds",
  excerpt: "A historic turnout at the campaign launch as residents from all five wards came out to declare 'Kuna More na Moha!'",
  featured: true
}, {
  img: galleryImg4,
  tag: "Education",
  date: "Apr 5, 2026",
  title: "600+ students received bursary cheques — KSh 3.6M disbursed Term 1 2026",
  excerpt: "The Moha Foundation closes its biggest bursary cycle yet — KSh 3.6M disbursed in Term 1 2026."
}, {
  img: healthImg,
  tag: "Health",
  date: "Mar 28, 2026",
  title: "Free legal, registration & medical camps reach thousands",
  excerpt: "ID & Passport registration, Voter registration, SHA registration, GBV desk support and free legal aid delivered alongside BP screening, eye care and pediatric services."
}, {
  img: environmentImg,
  tag: "Environment",
  date: "Mar 15, 2026",
  title: "Mathare cleanup: Tons of waste removed",
  excerpt: "Volunteers, youth groups, and Moha's team take to the river — a new beginning."
}, {
  img: businessImg,
  tag: "Business",
  date: "Mar 2, 2026",
  title: "Mama Mboga capital fund hits a milestone",
  excerpt: "Half-way to the target — 600+ mama mbogas already funded."
}];
function NewsPage() {
  const [featured, ...rest] = news;
  const {
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Top Stories"), title: t("The latest from the movement"), subtitle: t("Campaign milestones, community wins, and the work happening on the ground every single day."), bgImage: rallyImg }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 lg:px-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.article, { initial: {
        opacity: 0,
        y: 30
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        duration: 0.6
      }, className: "group rounded-3xl overflow-hidden bg-card border border-border shadow-elegant mb-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-video lg:aspect-auto overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: featured.img, alt: featured.title, loading: "lazy", width: 1600, height: 900, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 md:p-12 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 text-xs font-bold tracking-widest uppercase text-gold-foreground bg-gold rounded-full", children: [
              t("Featured"),
              " • ",
              t(featured.tag)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              featured.date
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl md:text-4xl font-display font-bold text-foreground text-balance", children: t(featured.title) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground leading-relaxed", children: t(featured.excerpt) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-6 inline-flex items-center gap-2 font-semibold text-primary self-start group-hover:gap-3 transition-all", children: [
            t("Read more"),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-2", children: rest.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
        opacity: 0,
        y: 30
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true
      }, transition: {
        duration: 0.5,
        delay: i * 0.08
      }, className: "group flex flex-col md:flex-row gap-5 bg-card border border-border rounded-2xl overflow-hidden shadow-elegant hover:shadow-glow transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative md:w-2/5 aspect-video md:aspect-auto overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: n.img, alt: n.title, loading: "lazy", width: 800, height: 600, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 md:py-6 md:pr-6 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase text-primary bg-primary/10 rounded-full", children: t(n.tag) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3" }),
              n.date
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors text-balance", children: t(n.title) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: t(n.excerpt) })
        ] })
      ] }, n.title)) })
    ] }) })
  ] });
}
export {
  NewsPage as component
};
