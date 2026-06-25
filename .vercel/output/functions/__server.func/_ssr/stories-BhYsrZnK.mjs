import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { u as useLanguage } from "./router-CXbsBUWo.mjs";
import { b as businessImg } from "./foundation5-KNE-pZVQ.mjs";
import { p as pwdImg } from "./moha30-BTk4hydQ.mjs";
import { g as galleryImg2 } from "./donation3-A-vImyKs.mjs";
import { g as galleryImg5, a as galleryImg3 } from "./moha40-DvwP6k7A.mjs";
import { r as rallyImg } from "./foundation1-BGwft8W6.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { Q as Quote } from "../_libs/lucide-react.mjs";
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
const stories = [{
  name: "Wanjiku M.",
  role: "Mama Mboga, Mathare 4A",
  quote: "Moha gave me KSh 20,000 to expand my stall. Today, I employ two of my neighbors. He didn't come for votes — he came for change.",
  img: businessImg
}, {
  name: "Brian O.",
  role: "Grade 10 Student",
  quote: "I had given up on Grade 10 admission because of fees. Moha's bursary brought me back. I'm now in school studying.",
  img: pwdImg
}, {
  name: "Mama Atieno",
  role: "Widow & Grandmother",
  quote: "Every month, the foundation sends food to my house. I take care of four grandchildren. Moha is family to us.",
  img: galleryImg2
}, {
  name: "David K.",
  role: "Youth Boda Rider",
  quote: "When the county wanted to chase us from the stage, Moha came and stood with us. He fights for the small man.",
  img: galleryImg5
}, {
  name: "Sarah N.",
  role: "PWD Entrepreneur",
  quote: "Moha got me a wheelchair and capital to start a tailoring shop. Now I'm independent. Mungu ambariki.",
  img: galleryImg3
}, {
  name: "Faith W.",
  role: "Student Voice, Mathare",
  quote: "Through Moha's bursary I went back to school, and his youth program gave me a place to dream again. He sees us — and he shows up.",
  img: rallyImg
}];
function StoriesPage() {
  const {
    t
  } = useLanguage();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Voices of Mathare"), title: t("Real people. Real impact."), subtitle: t("These are the stories of mama mbogas, students, elders, and youth whose lives Moha has changed — long before any campaign poster went up."), bgImage: businessImg }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "py-20 bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: stories.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { initial: {
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
      delay: i * 0.08
    }, className: "group bg-card border border-border rounded-2xl p-7 shadow-elegant hover:shadow-glow hover:-translate-y-1 transition-all duration-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "h-8 w-8 text-gold mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground leading-relaxed italic", children: [
        '"',
        t(s.quote),
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-3 pt-5 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: s.img, alt: s.name, loading: "lazy", className: "h-14 w-14 rounded-full object-cover ring-2 ring-gold/40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: s.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t(s.role) })
        ] })
      ] })
    ] }, s.name)) }) }) })
  ] });
}
export {
  StoriesPage as component
};
