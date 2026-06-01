// Loyalty visit counter for unlocking shareable business links.
import { useEffect, useState } from "react";

const VISIT_KEY = "moha_visit_count";
const VISIT_THRESHOLD = 8;

export function bumpVisitOncePerSession() {
  if (typeof window === "undefined") return;
  try {
    const SESSION_FLAG = "moha_visit_bumped";
    if (sessionStorage.getItem(SESSION_FLAG)) return;
    const n = Number(localStorage.getItem(VISIT_KEY) || "0") + 1;
    localStorage.setItem(VISIT_KEY, String(n));
    sessionStorage.setItem(SESSION_FLAG, "1");
    window.dispatchEvent(new CustomEvent("moha-visit-change"));
  } catch {
    /* ignore */
  }
}

export function getVisitCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(VISIT_KEY) || "0");
}

export function useLoyalty() {
  const [count, setCount] = useState(0);
  useEffect(() => {
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

export async function shareBusiness(business: { id: string; businessName: string }) {
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/advertise#biz-${business.id}`;
  const shareData = {
    title: business.businessName,
    text: `Check out ${business.businessName} on the Mathare Business Hub`,
    url,
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
    /* ignore */
  }
  return { shared: false, copied: false, url };
}
