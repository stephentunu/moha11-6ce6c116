// Central SEO helper — generates a consistent, complete set of meta tags for
// every page from a small set of inputs. This guarantees every route gets:
//   - a unique title and description
//   - Open Graph tags (Facebook/WhatsApp/LinkedIn previews)
//   - Twitter Card tags
//   - a canonical URL (prevents duplicate-content penalties)
//   - a sensible default share image when a page doesn't have its own
//
// Usage in any route file:
//
//   import { seoMeta } from "@/lib/seo";
//
//   export const Route = createFileRoute("/priorities")({
//     head: () => ({ meta: seoMeta({
//       title: "Priorities — Moha Delivers",
//       description: "...",
//       path: "/priorities",
//     }) }),
//   });

export const SITE_NAME = "Moha Delivers";
export const SITE_URL = "https://mohadelivers.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const TWITTER_HANDLE = "@MohaForMathare";

type SeoOptions = {
  /** Page-specific title. Site name is appended automatically unless `bare` is true. */
  title: string;
  /** 1–2 sentence description, ideally 120–160 characters. */
  description: string;
  /** Route path starting with "/", used to build the canonical URL. */
  path: string;
  /** Absolute URL to a 1200x630 share image. Falls back to the site default. */
  image?: string;
  /** "website" | "article" | "profile" — defaults to "website". */
  type?: "website" | "article" | "profile";
  /** Set true to use the title exactly as given, without appending the site name. */
  bare?: boolean;
  /** Set true to prevent indexing (in addition to admin's own noindex rules). */
  noindex?: boolean;
};

export function seoMeta(opts: SeoOptions) {
  const fullTitle = opts.bare ? opts.title : `${opts.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${opts.path}`;
  const image = opts.image || DEFAULT_OG_IMAGE;
  const type = opts.type || "website";

  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: opts.description },

    // Open Graph
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: opts.description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_KE" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: opts.description },
    { name: "twitter:image", content: image },
    { name: "twitter:site", content: TWITTER_HANDLE },
  ];

  if (opts.noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  } else {
    meta.push({ name: "robots", content: "index, follow" });
  }

  return meta;
}

/** Canonical link tag — pair with seoMeta() in the route's head() links array. */
export function seoLinks(path: string) {
  return [{ rel: "canonical", href: `${SITE_URL}${path}` }];
}

/** JSON-LD structured data for the Organization — include once, on the homepage. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "Moha for Mathare",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Moha for Mathare 2027 — a movement for education, health, business, and environment in Mathare constituency, Nairobi.",
    areaServed: {
      "@type": "Place",
      name: "Mathare, Nairobi, Kenya",
    },
    sameAs: [] as string[],
  };
}

/** JSON-LD structured data for Moha as a public figure / political candidate. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Moha",
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    jobTitle: "2027 MP Aspirant — Mathare Constituency",
    description:
      "Moha is a 2027 Member of Parliament aspirant for Mathare constituency, Nairobi, focused on education, health, business support, and environmental initiatives.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mathare",
      addressRegion: "Nairobi",
      addressCountry: "KE",
    },
  };
}

/** JSON-LD BreadcrumbList — helps Google show breadcrumb trails in search results. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}