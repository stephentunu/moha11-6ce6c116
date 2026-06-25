import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useLanguage, B as Button, c as cn } from "./router-CXbsBUWo.mjs";
import { P as PageHero } from "./PageHero-CbBipLjp.mjs";
import { I as Input } from "./input-DKkwU37r.mjs";
import { L as Label } from "./label-CJiRYFTX.mjs";
import { T as Textarea } from "./textarea-PZUwCibH.mjs";
import { B as Badge } from "./badge--Vxi6TND.mjs";
import { C as Checkbox } from "./checkbox-5WWmtZFV.mjs";
import { S as Switch } from "./switch-DiHBL9dB.mjs";
import { u as useEmblaCarousel } from "../_libs/embla-carousel-react.mjs";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription } from "./dialog-PwpLs1Wj.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bbw65E3G.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { e as useBusinesses, f as addBusiness, c as addMessage } from "./admin-store-Pu01Ao05.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
import { N as Plus, O as Search, S as Sparkles, W as HardHat, Y as Shirt, B as Briefcase, G as GraduationCap, Z as Monitor, _ as Music, $ as Church, a0 as UtensilsCrossed, f as Store, a1 as ShoppingBasket, a2 as Stethoscope, a3 as Sofa, a4 as Settings, a5 as House, a6 as Wrench, X, a as MapPin, a7 as Truck, a8 as ExternalLink, a9 as Bus, aa as Banknote, c as MessageCircle, x as Share2, j as CircleCheck, ab as Globe, P as Phone, ac as Upload, g as ShieldCheck, ad as ChevronLeft, ae as ChevronRight, A as ArrowLeft, q as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/embla-carousel-reactive-utils.mjs";
import "../_libs/embla-carousel.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
const CarouselContext = reactExports.createContext(null);
function useCarousel() {
  const context = reactExports.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}
const Carousel = reactExports.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y"
    },
    plugins
  );
  const [canScrollPrev, setCanScrollPrev] = reactExports.useState(false);
  const [canScrollNext, setCanScrollNext] = reactExports.useState(false);
  const onSelect = reactExports.useCallback((api2) => {
    if (!api2) {
      return;
    }
    setCanScrollPrev(api2.canScrollPrev());
    setCanScrollNext(api2.canScrollNext());
  }, []);
  const scrollPrev = reactExports.useCallback(() => {
    api?.scrollPrev();
  }, [api]);
  const scrollNext = reactExports.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  const handleKeyDown = reactExports.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );
  reactExports.useEffect(() => {
    if (!api || !setApi) {
      return;
    }
    setApi(api);
  }, [api, setApi]);
  reactExports.useEffect(() => {
    if (!api) {
      return;
    }
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CarouselContext.Provider,
    {
      value: {
        carouselRef,
        api,
        opts,
        orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref,
          onKeyDownCapture: handleKeyDown,
          className: cn("relative", className),
          role: "region",
          "aria-roledescription": "carousel",
          ...props,
          children
        }
      )
    }
  );
});
Carousel.displayName = "Carousel";
const CarouselContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: carouselRef, className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        ),
        ...props
      }
    ) });
  }
);
CarouselContent.displayName = "CarouselContent";
const CarouselItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        role: "group",
        "aria-roledescription": "slide",
        className: cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        ),
        ...props
      }
    );
  }
);
CarouselItem.displayName = "CarouselItem";
const CarouselPrevious = reactExports.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute  h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollPrev,
        onClick: scrollPrev,
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Previous slide" })
        ]
      }
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";
const CarouselNext = reactExports.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        ref,
        variant,
        size,
        className: cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          className
        ),
        disabled: !canScrollNext,
        onClick: scrollNext,
        ...props,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Next slide" })
        ]
      }
    );
  }
);
CarouselNext.displayName = "CarouselNext";
const VISIT_KEY = "moha_visit_count";
const VISIT_THRESHOLD = 8;
function getVisitCount() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(VISIT_KEY) || "0");
}
function useLoyalty() {
  const [count, setCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    setCount(getVisitCount());
    const h = () => setCount(getVisitCount());
    window.addEventListener("moha-visit-change", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("moha-visit-change", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return { visits: count, unlocked: count > VISIT_THRESHOLD, threshold: VISIT_THRESHOLD };
}
async function shareBusiness(business) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/advertise#biz-${business.id}`;
  const shareData = {
    title: business.businessName,
    text: `Check out ${business.businessName} on the Mathare Business Hub`,
    url
  };
  try {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share(shareData);
      return { shared: true, url };
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return { shared: false, copied: true, url };
    }
  } catch {
  }
  return { shared: false, copied: false, url };
}
const WARDS = ["Mabatini", "Huruma", "Hospital", "Kiamaiko", "Ngei", "Mlango Kubwa"];
const CATEGORIES = [{
  value: "Beauty and Skincare- Cosmetics, Salons, Barbershops & Related",
  icon: Sparkles
}, {
  value: "Building and Construction -Electrical, Plumbing & Hardware",
  icon: HardHat
}, {
  value: "Clothing and Fashion -Uniforms, Shoes, Clothes & Related",
  icon: Shirt
}, {
  value: "Consultancy, Job Offers and Seeking",
  icon: Briefcase
}, {
  value: "Education and Training -Bookshops, Colleges, Teaching & Related",
  icon: GraduationCap
}, {
  value: "Electronics – Phones, Computers, TVs & Related",
  icon: Monitor
}, {
  value: "Entertainment – Pubs, Night Clubs, Video Shows & Related",
  icon: Music
}, {
  value: "Evangelical, Crusades and Worship",
  icon: Church
}, {
  value: "Food -Hotels, Water, Butcheries & Related",
  icon: UtensilsCrossed
}, {
  value: "General Shops and Vending– Retail, Wholesale, Agrovets & Related",
  icon: Store
}, {
  value: "Groceries and Fish -Fresh Farm Produce & Related",
  icon: ShoppingBasket
}, {
  value: "Health -Pharmacies, Chemicals, Fitness Centres & Related",
  icon: Stethoscope
}, {
  value: "Home Accessories – Juakali, Garden, Kitchen, Furniture & Related",
  icon: Sofa
}, {
  value: "Machinery and Spare Shops – Cars, Motorbikes, Electronics & Related",
  icon: Settings
}, {
  value: "Photography – Portraits, Events, Passports & Related",
  icon: Sparkles
}, {
  value: "Artwork and Drawing – Paintings, Illustrations, Graphic Design & Related",
  icon: Monitor
}, {
  value: "Property and Houses to Rent, Sale or Lease",
  icon: House
}, {
  value: "Services – Repairs, Cleaning, Transport, Garage, Printing & Related",
  icon: Wrench
}];
const PAYMENT_OPTIONS = [{
  value: "send_money",
  label: "Send Money"
}, {
  value: "pochi",
  label: "Pochi la Biashara"
}, {
  value: "till",
  label: "Till Number"
}, {
  value: "paybill",
  label: "Paybill"
}, {
  value: "cash",
  label: "Cash"
}];
const PAYMENT_LABELS = {
  send_money: "Send Money",
  pochi: "Pochi la Biashara",
  till: "Till",
  paybill: "Paybill",
  cash: "Cash"
};
function categoryIcon(name) {
  const found = CATEGORIES.find((c) => c.value === name);
  return found ? found.icon : Store;
}
function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("7") || digits.startsWith("1")) return "254" + digits;
  return digits;
}
function whatsappLink(phone, businessName) {
  const normalized = normalizePhone(phone);
  const text = encodeURIComponent(`Hello, I found ${businessName} on the Moha Mathare Business Hub. I'd like to enquire about your services.`);
  return `https://wa.me/${normalized}?text=${text}`;
}
const EMPTY_FORM = {
  ownerName: "",
  businessName: "",
  category: "",
  ward: "",
  location: "",
  street: "",
  phone: "",
  contacts: "",
  description: "",
  websiteUrl: "",
  imageUrls: [],
  paymentMethods: [],
  tillPaybillNumber: "",
  nearestTransport: "",
  deliveryAvailable: false,
  dataConsent: false
};
function AdvertisePage() {
  const {
    t
  } = useLanguage();
  const [allBusinesses] = useBusinesses();
  const businesses = reactExports.useMemo(() => allBusinesses.filter((b) => b.status === "active"), [allBusinesses]);
  const [search, setSearch] = reactExports.useState("");
  const [wardFilter, setWardFilter] = reactExports.useState("all");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return businesses.filter((b) => {
      if (wardFilter !== "all" && b.ward !== wardFilter) return false;
      if (categoryFilter !== "all" && b.category !== categoryFilter) return false;
      if (!q) return true;
      return b.businessName.toLowerCase().includes(q) || b.ownerName.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) || b.location.toLowerCase().includes(q);
    });
  }, [businesses, search, wardFilter, categoryFilter]);
  const handleAdd = async (b) => {
    try {
      await addBusiness(b);
      toast.success("Your business is now live on the hub!", {
        description: "Residents can now find and contact you on WhatsApp."
      });
    } catch (err) {
      console.error(err);
      toast.error("Could not save your listing", {
        description: "Please check your connection and try again."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHero, { eyebrow: t("Mathare Business Hub"), title: t("Advertise With Us"), subtitle: t("Supporting Mathare Businesses — Moha Delivers. List your hustle for free with photos, payment options and delivery info.") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 lg:px-8 -mt-8 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-elegant p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl md:text-2xl font-bold", children: t("Ready to grow your customer base?") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: t("List your business in under 2 minutes. Always free.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "hero", onClick: () => setOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }),
          t("Advertise Your Business")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", onClick: () => document.getElementById("marketplace")?.scrollIntoView({
          behavior: "smooth"
        }), children: t("Browse Marketplace") })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "marketplace", className: "container mx-auto px-4 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "mb-4", children: [
          businesses.length,
          " ",
          t("businesses listed")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-5xl font-black mb-4", children: [
          t("Mathare's"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-primary", children: t("Marketplace") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: t("Discover trusted local businesses run by your neighbours. Filter by ward or category to find exactly what you need.") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 md:p-6 shadow-sm mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-6 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: t("Search businesses, owners or services..."), value: search, onChange: (e) => setSearch(e.target.value), className: "pl-9 h-11" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: wardFilter, onValueChange: setWardFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: t("All Wards") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: t("All Wards") }),
              WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: w }, w))
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: categoryFilter, onValueChange: setCategoryFilter, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-11", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: t("All Categories") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: t("All Categories") }),
              CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.value, children: c.value }, c.value))
            ] })
          ] }) })
        ] }),
        (wardFilter !== "all" || categoryFilter !== "all" || search) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold", children: t("Active filters:") }),
          wardFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
            wardFilter,
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setWardFilter("all"), "aria-label": "Clear ward filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }),
          categoryFilter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
            categoryFilter,
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCategoryFilter("all"), "aria-label": "Clear category filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] }),
          search && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1", children: [
            '"',
            search,
            '"',
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), "aria-label": "Clear search", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }) })
          ] })
        ] })
      ] }),
      filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 border-2 border-dashed border-border rounded-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-12 w-12 mx-auto text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-2xl font-bold mb-2", children: t("No businesses match your search") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-6", children: t("Try clearing filters or be the first to list in this category.") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setOpen(true), variant: "hero", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          t("List Your Business")
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BusinessCard, { business: b, index: i }, b.id)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "container mx-auto px-4 lg:px-8 pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-primary rounded-3xl p-8 md:p-14 text-center shadow-glow", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-5xl font-black text-primary-foreground mb-4", children: t("Your hustle deserves to be seen") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8", children: t("Join hundreds of Mathare entrepreneurs growing their customer base through Moha's free community marketplace.") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "xl", variant: "hero", onClick: () => setOpen(true), className: "bg-gold text-gold-foreground hover:bg-gold/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5" }),
        t("Advertise Your Business — Free")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RegistrationDialog, { open, onOpenChange: setOpen, onSubmit: handleAdd })
  ] });
}
function BusinessCard({
  business,
  index
}) {
  const {
    t
  } = useLanguage();
  const Icon = categoryIcon(business.category);
  const loyalty = useLoyalty();
  const images = business.imageUrls.length ? business.imageUrls : business.imageUrl ? [business.imageUrl] : [];
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const handleShare = async () => {
    const result = await shareBusiness(business);
    if (result.shared) return;
    if (result.copied) toast.success("Link copied — share it with friends!");
    else toast.info(result.url);
  };
  const ImgWrap = ({
    children
  }) => business.websiteUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: business.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "block w-full h-full", "aria-label": `Open ${business.businessName} website`, children }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.article, { id: `biz-${business.id}`, layout: true, initial: {
    opacity: 0,
    y: 24
  }, animate: {
    opacity: 1,
    y: 0
  }, exit: {
    opacity: 0,
    y: -12
  }, transition: {
    duration: 0.4,
    delay: Math.min(index * 0.05, 0.4)
  }, className: "group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] overflow-hidden bg-muted", children: [
      images.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Carousel, { className: "w-full h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselContent, { className: "h-full", children: images.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselItem, { className: "h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full aspect-[4/3]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ImgWrap, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: `${business.businessName} photo ${idx + 1}`, loading: "lazy", className: "w-full h-full object-cover" }) }) }) }, idx)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselPrevious, { className: "left-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CarouselNext, { className: "right-2" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ImgWrap, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: images[0], alt: business.businessName, loading: "lazy", className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 left-3 flex flex-col gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-background/95 text-foreground border border-border backdrop-blur-sm gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          business.ward,
          " Ward"
        ] }),
        business.deliveryAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-600 text-white border-none gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3" }),
          t("Delivery")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-3 right-3 flex items-center gap-2", children: [
        business.websiteUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: business.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors", "aria-label": "Open website", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-background/95 backdrop-blur-sm border border-border flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 flex-1 flex flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-primary mb-1 line-clamp-1", children: business.category }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold mb-1 line-clamp-1", children: business.businessName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[2.5rem]", children: business.description || `Run by ${business.ownerName}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 mb-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: business.street || business.location })
        ] }),
        business.nearestTransport && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "h-3 w-3 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: business.nearestTransport })
        ] })
      ] }),
      business.paymentMethods.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mb-4", children: business.paymentMethods.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Banknote, { className: "h-3 w-3" }),
        PAYMENT_LABELS[m] ? t(PAYMENT_LABELS[m]) : m,
        (m === "till" || m === "paybill") && business.tillPaybillNumber ? ` ${business.tillPaybillNumber}` : ""
      ] }, m)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: whatsappLink(business.phone, business.businessName), target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[#25D366] hover:bg-[#1ebe5b] text-white font-semibold transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
          t("Contact via WhatsApp")
        ] }),
        loyalty.unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: handleShare, className: "flex items-center justify-center gap-2 w-full h-10 rounded-md border border-gold text-gold hover:bg-gold hover:text-gold-foreground font-semibold transition-colors text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
          t("Share this business")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditOpen(true), className: "flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary font-semibold transition-colors text-sm", children: t("Request edits to this listing") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditRequestDialog, { business, open: editOpen, onOpenChange: setEditOpen })
  ] });
}
function EditRequestDialog({
  business,
  open,
  onOpenChange
}) {
  const {
    t
  } = useLanguage();
  const [name, setName] = reactExports.useState(business.ownerName);
  const [contact, setContact] = reactExports.useState(business.phone);
  const [changes, setChanges] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = () => {
    if (!name.trim() || !contact.trim() || changes.trim().length < 5) {
      toast.error("Please fill in your name, contact and the changes you need.");
      return;
    }
    setBusy(true);
    try {
      addMessage({
        kind: "opinion",
        name: name.trim(),
        contact: contact.trim(),
        body: `BUSINESS EDIT REQUEST
Listing: ${business.businessName} (ID: ${business.id})
Category: ${business.category}
Ward: ${business.ward}

Requested changes:
${changes.trim()}`
      });
      toast.success("Edit request sent to the admin team", {
        description: "Moha's team will review and update your listing shortly."
      });
      setChanges("");
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: t("Request edits to your listing") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        t("Tell the admin what to change about"),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: business.businessName }),
        " (location, contacts, photos, payment details, etc.). The team will verify and update for you."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "er-name", children: t("Your name") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "er-name", value: name, onChange: (e) => setName(e.target.value), maxLength: 80 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "er-contact", children: t("Phone / WhatsApp contact") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "er-contact", value: contact, onChange: (e) => setContact(e.target.value), maxLength: 40 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "er-changes", children: t("What needs to change?") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "er-changes", rows: 5, maxLength: 1e3, value: changes, onChange: (e) => setChanges(e.target.value), placeholder: "e.g. New location: Mathare 4B, opposite Mary's Pharmacy. Update phone to 07XX…" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: t("Cancel") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "hero", onClick: submit, disabled: busy, children: t("Send request") })
    ] })
  ] }) });
}
function RegistrationDialog({
  open,
  onOpenChange,
  onSubmit
}) {
  const {
    t
  } = useLanguage();
  const [step, setStep] = reactExports.useState(0);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const fileRef = reactExports.useRef(null);
  const reset = () => {
    setStep(0);
    setForm(EMPTY_FORM);
  };
  const handleClose = (v) => {
    if (!v) setTimeout(reset, 200);
    onOpenChange(v);
  };
  const update = (key, value) => setForm((f) => ({
    ...f,
    [key]: value
  }));
  const togglePayment = (pm) => setForm((f) => ({
    ...f,
    paymentMethods: f.paymentMethods.includes(pm) ? f.paymentMethods.filter((x) => x !== pm) : [...f.paymentMethods, pm]
  }));
  const [uploading, setUploading] = reactExports.useState(false);
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = Math.max(0, 5 - form.imageUrls.length);
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) {
      toast.error("You can upload up to 5 photos");
      return;
    }
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of toUpload) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is over 5MB and was skipped`);
          continue;
        }
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const {
          error: upErr
        } = await supabase.storage.from("business-images").upload(path, file, {
          contentType: file.type,
          upsert: false
        });
        if (upErr) throw upErr;
        const {
          data
        } = supabase.storage.from("business-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setForm((f) => ({
        ...f,
        imageUrls: [...f.imageUrls, ...uploaded]
      }));
    } catch (err) {
      console.error(err);
      toast.error("Could not upload one or more images");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const removeImage = (idx) => setForm((f) => ({
    ...f,
    imageUrls: f.imageUrls.filter((_, i) => i !== idx)
  }));
  const validateStep = (s) => {
    if (s === 0) {
      if (!form.ownerName.trim()) return "Please enter your name";
      if (!form.businessName.trim()) return "Please enter your business name";
      if (!form.category) return "Please choose a business category";
    }
    if (s === 1) {
      if (!form.ward) return "Please select your ward";
      if (!form.location.trim()) return "Please enter your area / location";
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 9) return "Please enter a valid WhatsApp number";
    }
    if (s === 2) {
      if (form.paymentMethods.length === 0) return "Select at least one payment method";
      if ((form.paymentMethods.includes("till") || form.paymentMethods.includes("paybill")) && !form.tillPaybillNumber.trim()) {
        return "Enter your Till / Paybill number";
      }
    }
    if (s === 3) {
      if (form.imageUrls.length === 0) return "Please upload at least one photo";
      if (!form.dataConsent) return "Please read and accept the Data Policy before publishing";
    }
    return null;
  };
  const next = () => {
    const err = validateStep(step);
    if (err) {
      toast.error(err);
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateStep(3);
    if (err) {
      toast.error(err);
      return;
    }
    onSubmit({
      id: `b-${Date.now()}`,
      ownerName: form.ownerName.trim(),
      businessName: form.businessName.trim(),
      category: form.category,
      ward: form.ward,
      location: form.location.trim(),
      street: form.street.trim() || void 0,
      phone: form.phone.trim(),
      contacts: form.contacts.trim() || void 0,
      description: form.description.trim(),
      websiteUrl: form.websiteUrl.trim() || void 0,
      imageUrl: form.imageUrls[0] ?? "",
      imageUrls: form.imageUrls,
      paymentMethods: form.paymentMethods,
      tillPaybillNumber: form.tillPaybillNumber.trim() || void 0,
      nearestTransport: form.nearestTransport.trim() || void 0,
      deliveryAvailable: form.deliveryAvailable,
      status: "active",
      createdAt: Date.now()
    });
    handleClose(false);
  };
  const steps = [t("About You"), t("Location & Contact"), t("Payments & Service"), t("Photos & Launch")];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-2xl", children: t("List Your Business") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: t("Free for every Mathare entrepreneur. Takes about 3 minutes.") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 my-2", children: steps.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors", i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-gold text-gold-foreground" : "bg-muted text-muted-foreground"), children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs font-semibold hidden sm:inline", i === step ? "text-foreground" : "text-muted-foreground"), children: label }),
      i < steps.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-0.5 bg-muted rounded-full" })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { mode: "wait", children: [
        step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          x: 20
        }, animate: {
          opacity: 1,
          x: 0
        }, exit: {
          opacity: 0,
          x: -20
        }, transition: {
          duration: 0.2
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ownerName", children: t("Your Name *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ownerName", placeholder: "e.g. Jane Wanjiku", value: form.ownerName, onChange: (e) => update("ownerName", e.target.value), maxLength: 80 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "businessName", children: t("Business Name *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "businessName", placeholder: "e.g. Jane's Fresh Mboga", value: form.businessName, onChange: (e) => update("businessName", e.target.value), maxLength: 80 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("Business Type *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.category, onValueChange: (v) => update("category", v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: t("Choose a category") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => {
                const Icon = c.icon;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.value, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
                  c.value
                ] }) }, c.value);
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "websiteUrl", className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5" }),
              " ",
              t("Website / Social Page (optional)")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "websiteUrl", type: "url", placeholder: "https://yourbiz.co.ke", value: form.websiteUrl, onChange: (e) => update("websiteUrl", e.target.value), maxLength: 200 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("Your photos will open this link when customers click them.") })
          ] })
        ] }, "step-0"),
        step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          x: 20
        }, animate: {
          opacity: 1,
          x: 0
        }, exit: {
          opacity: 0,
          x: -20
        }, transition: {
          duration: 0.2
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("Ward *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.ward, onValueChange: (v) => update("ward", v), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: t("Select your Mathare ward") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: WARDS.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: w, children: w }, w)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "location", children: t("Area / Estate *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "location", placeholder: "e.g. Mathare 4A", value: form.location, onChange: (e) => update("location", e.target.value), maxLength: 120 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "street", children: t("Street / Precise Location") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "street", placeholder: "e.g. Opposite Huruma Stage, 1st floor", value: form.street, onChange: (e) => update("street", e.target.value), maxLength: 120 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", children: t("WhatsApp / Phone Contact *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "phone", type: "tel", placeholder: "07XX XXX XXX", value: form.phone, onChange: (e) => update("phone", e.target.value), className: "pl-9", maxLength: 20 })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "contacts", children: t("Additional Contacts (optional)") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "contacts", placeholder: "e.g. 07XX XXX XXX, info@biz.co.ke", value: form.contacts, onChange: (e) => update("contacts", e.target.value), maxLength: 200 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: t("Short Description (optional)") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "description", placeholder: t("What do you sell or offer?"), value: form.description, onChange: (e) => update("description", e.target.value), maxLength: 200, rows: 3 })
          ] })
        ] }, "step-1"),
        step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          x: 20
        }, animate: {
          opacity: 1,
          x: 0
        }, exit: {
          opacity: 0,
          x: -20
        }, transition: {
          duration: 0.2
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("Payment Methods Accepted *") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2", children: PAYMENT_OPTIONS.map((opt) => {
              const checked = form.paymentMethods.includes(opt.value);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cn("flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors", checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked, onCheckedChange: () => togglePayment(opt.value) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: t(opt.label) })
              ] }, opt.value);
            }) })
          ] }),
          (form.paymentMethods.includes("till") || form.paymentMethods.includes("paybill")) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tillPaybill", children: "Till / Paybill Number *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "tillPaybill", placeholder: "e.g. 522522 or 123456", value: form.tillPaybillNumber, onChange: (e) => update("tillPaybillNumber", e.target.value), maxLength: 20 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "nearestTransport", children: t("Means of Transport") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "nearestTransport", placeholder: "e.g. Taxi, Bodaboda, Matatu, Tuk-tuk", value: form.nearestTransport, onChange: (e) => update("nearestTransport", e.target.value), maxLength: 120 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg border border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "delivery", className: "cursor-pointer", children: t("Delivery Available") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("Toggle on if you deliver to customers.") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { id: "delivery", checked: form.deliveryAvailable, onCheckedChange: (v) => update("deliveryAvailable", v) })
          ] })
        ] }, "step-2"),
        step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          x: 20
        }, animate: {
          opacity: 1,
          x: 0
        }, exit: {
          opacity: 0,
          x: -20
        }, transition: {
          duration: 0.2
        }, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: t("Business Photos * (up to 5)") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, onChange: handleFiles, className: "hidden" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
              form.imageUrls.map((src, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden border border-border aspect-square", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: `Photo ${idx + 1}`, className: "w-full h-full object-cover" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => removeImage(idx), className: "absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-background/95 border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors", "aria-label": "Remove image", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
              ] }, idx)),
              form.imageUrls.length < 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => fileRef.current?.click(), disabled: uploading, className: "aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary disabled:opacity-60 disabled:cursor-wait", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold", children: uploading ? t("Uploading…") : t("Add photo") })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: t("JPG or PNG, up to 5MB each. The first photo becomes your cover.") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-xl p-4 text-sm space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: t("Preview:") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("Business:") }),
              " ",
              form.businessName || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                t("Ward"),
                ":"
              ] }),
              " ",
              form.ward || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("Payments:") }),
              " ",
              form.paymentMethods.map((m) => PAYMENT_LABELS[m]).join(", ") || "—"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: t("Delivery:") }),
              " ",
              form.deliveryAvailable ? t("Yes") : t("No")
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-gold/40 bg-gold/5 p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-gold shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-sm text-foreground", children: "Data Policy & Consent" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
              "The information you provide will be displayed publicly on the Mathare Business Hub to connect you with customers. Your name, business details, and contact information will be visible to visitors of this platform. We do not sell your data to third parties. You may request removal of your listing at any time by contacting us at ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "hello@mohadelivers.com" }),
              " or the Moha Coordination Office, Kiamako-Mathare. By publishing, you confirm that the information is accurate and that you have the right to list this business."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 cursor-pointer group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: form.dataConsent, onCheckedChange: (v) => update("dataConsent", Boolean(v)), className: "mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground group-hover:text-primary transition-colors", children: t("I have read and understood the data policy. I consent to my business information being displayed publicly on the Mathare Business Hub. *") })
            ] })
          ] })
        ] }, "step-3")
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 pt-4 border-t border-border", children: [
        step > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", onClick: back, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
          " ",
          t("Back")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
        step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "default", onClick: next, children: [
          t("Next"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", variant: "hero", disabled: !form.dataConsent, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
          " ",
          t("Publish My Business")
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AdvertisePage as component
};
