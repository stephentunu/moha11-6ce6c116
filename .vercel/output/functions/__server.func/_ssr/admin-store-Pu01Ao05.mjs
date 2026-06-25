import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-r8zzNwlx.mjs";
const KEYS = {
  polls: "moha.polls.v4",
  pollVotes: "moha.pollVotes.v1",
  messages: "moha.messages.v1",
  content: "moha.content.v1",
  auth: "moha.admin.session.v1",
  activities: "moha.activities.v1"
};
const MATHARE_WARDS = [
  "Mabatini",
  "Huruma",
  "Hospital",
  "Kiamaiko",
  "Ngei",
  "Mlango Kubwa"
];
const ADMIN_EMAIL = "admin2027@gmail.com";
const ADMIN_PASSWORD = "moha2027";
const DEFAULT_POLLS = [
  {
    id: "p1",
    question: "What is the #1 issue Mathare needs solved first?",
    options: [
      { id: "a", label: "Education funding", votes: 0 },
      { id: "b", label: "Pollution and waste management", votes: 0 },
      { id: "c", label: "Drainage and flooding", votes: 0 },
      { id: "d", label: "Insecurity and safety", votes: 0 },
      { id: "e", label: "Financial constraints and credits inaccessibility", votes: 0 },
      { id: "f", label: "Crime, rape and GBV", votes: 0 },
      { id: "g", label: "Youth unemployment", votes: 0 }
    ]
  },
  // Service rating polls (Best / Fairly / Worst) — replaces the old Youth Hub poll.
  ...["Education", "Health", "Security", "Business Support", "All Services Overall", "Other (None of the above)"].map(
    (svc, i) => ({
      id: `p_svc_${i}`,
      question: `How do you rate Moha's delivery on ${svc}?`,
      options: [
        { id: "best", label: "Best", votes: 0 },
        { id: "fair", label: "Fairly", votes: 0 },
        { id: "worst", label: "Worst", votes: 0 }
      ]
    })
  ),
  {
    id: "p3",
    question: "Which education program should we expand next?",
    options: [
      { id: "a", label: "University tuition fund", votes: 0 },
      { id: "b", label: "Digital learning labs", votes: 0 },
      { id: "c", label: "TVET scholarships", votes: 0 },
      { id: "d", label: "Adult literacy classes", votes: 0 },
      { id: "e", label: "High school Bursaries and scholarships", votes: 0 }
    ]
  },
  {
    id: "p4",
    question: "How strongly do you agree with Moha's initiatives & projects in Mathare?",
    options: [
      { id: "a", label: "Strongly agree", votes: 0 },
      { id: "b", label: "Agree", votes: 0 },
      { id: "c", label: "Neutral", votes: 0 },
      { id: "d", label: "Disagree", votes: 0 },
      { id: "e", label: "Strongly disagree", votes: 0 }
    ]
  },
  {
    id: "p5",
    question: "Is Moha the best candidate for Mathare MP in 2027?",
    options: [
      { id: "a", label: "Yes — he's the best option", votes: 0 },
      { id: "b", label: "Likely yes", votes: 0 },
      { id: "c", label: "Undecided", votes: 0 },
      { id: "d", label: "Likely no", votes: 0 },
      { id: "e", label: "No", votes: 0 }
    ]
  }
];
const DEFAULT_CONTENT = {
  homeHeadline: "Moha Delivers.",
  homeTagline: "Kuna More na Moha!",
  homeQuote: "Mathare raised me. Now it's my turn to raise Mathare. We don't need promises — we need delivery.",
  homeQuoteAuthor: "Moha",
  prioritiesHeadline: "Our Priorities",
  prioritiesSubtitle: "Education, Health, Business, Environment.",
  foundationsHeadline: "The Moha Foundation",
  foundationsSubtitle: "Real work that does not wait for elections.",
  heroImageUrl: "",
  bursaryWindowStart: ""
};
const isBrowser = () => typeof window !== "undefined";
function read(key, fallback) {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, value) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("moha-store", { detail: { key } }));
  } catch {
  }
}
function useStore(key, fallback) {
  const [value, setValue] = reactExports.useState(fallback);
  reactExports.useEffect(() => {
    setValue(read(key, fallback));
    const handler = (e) => {
      const ce = e;
      if (!ce.detail || ce.detail.key === key) setValue(read(key, fallback));
    };
    window.addEventListener("moha-store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("moha-store", handler);
      window.removeEventListener("storage", handler);
    };
  }, [key]);
  const update = (v) => {
    setValue((prev) => {
      const next = typeof v === "function" ? v(prev) : v;
      write(key, next);
      return next;
    });
  };
  return [value, update];
}
function rowToBusiness(r) {
  const gallery = (r.image_urls && r.image_urls.length ? r.image_urls : r.image_url ? [r.image_url] : []).filter(Boolean);
  return {
    id: r.id,
    ownerName: r.owner_name,
    businessName: r.business_name,
    category: r.category,
    ward: r.ward,
    location: r.location,
    phone: r.phone,
    description: r.description,
    imageUrl: r.image_url || gallery[0] || "",
    imageUrls: gallery,
    websiteUrl: r.website_url ?? void 0,
    street: r.street ?? void 0,
    contacts: r.contacts ?? void 0,
    paymentMethods: r.payment_methods ?? [],
    tillPaybillNumber: r.till_paybill_number ?? void 0,
    nearestTransport: r.nearest_transport ?? void 0,
    deliveryAvailable: Boolean(r.delivery_available),
    status: r.status === "suspended" ? "suspended" : "active",
    createdAt: new Date(r.created_at).getTime()
  };
}
const BUSINESS_EVENT = "moha-businesses";
function emitBusinessChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(BUSINESS_EVENT));
}
function useBusinesses() {
  const [list, setList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase.from("businesses").select("*").order("created_at", { ascending: false });
      if (!cancelled && !error && data) {
        setList(data.map(rowToBusiness));
      }
    };
    load();
    const handler = () => load();
    window.addEventListener(BUSINESS_EVENT, handler);
    const channel = supabase.channel("businesses-changes").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "businesses" },
      () => load()
    ).subscribe();
    return () => {
      cancelled = true;
      window.removeEventListener(BUSINESS_EVENT, handler);
      supabase.removeChannel(channel);
    };
  }, []);
  return [list, setList];
}
async function addBusiness(b) {
  const { error } = await supabase.from("businesses").insert({
    owner_name: b.ownerName,
    business_name: b.businessName,
    category: b.category,
    ward: b.ward,
    location: b.location,
    phone: b.phone,
    description: b.description ?? "",
    image_url: b.imageUrl ?? (b.imageUrls?.[0] ?? ""),
    image_urls: b.imageUrls ?? [],
    website_url: b.websiteUrl ?? null,
    street: b.street ?? null,
    contacts: b.contacts ?? null,
    payment_methods: b.paymentMethods ?? [],
    till_paybill_number: b.tillPaybillNumber ?? null,
    nearest_transport: b.nearestTransport ?? null,
    delivery_available: b.deliveryAvailable ?? false,
    status: b.status ?? "active"
  });
  if (error) throw error;
  emitBusinessChange();
}
async function deleteBusiness(id) {
  const { error } = await supabase.from("businesses").delete().eq("id", id);
  if (error) throw error;
  emitBusinessChange();
}
async function setBusinessStatus(id, status) {
  const { error } = await supabase.from("businesses").update({ status }).eq("id", id);
  if (error) throw error;
  emitBusinessChange();
}
function usePolls() {
  return useStore(KEYS.polls, DEFAULT_POLLS);
}
function usePollVotes() {
  return useStore(KEYS.pollVotes, []);
}
function votePoll(pollId, optionId, ward) {
  const list = read(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map(
      (p) => p.id !== pollId ? p : {
        ...p,
        options: p.options.map((o) => {
          if (o.id !== optionId) return o;
          const byWard = { ...o.votesByWard ?? {} };
          if (ward) byWard[ward] = (byWard[ward] ?? 0) + 1;
          return { ...o, votes: o.votes + 1, votesByWard: byWard };
        })
      }
    )
  );
  const log = read(KEYS.pollVotes, []);
  const entry = {
    id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    pollId,
    optionId,
    ward,
    createdAt: Date.now()
  };
  write(KEYS.pollVotes, [entry, ...log].slice(0, 1e3));
}
function resetPoll(pollId) {
  const list = read(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map(
      (p) => p.id !== pollId ? p : { ...p, options: p.options.map((o) => ({ ...o, votes: 0, votesByWard: {} })) }
    )
  );
  const log = read(KEYS.pollVotes, []);
  write(KEYS.pollVotes, log.filter((v) => v.pollId !== pollId));
}
function useMessages() {
  return useStore(KEYS.messages, []);
}
function addMessage(m) {
  const list = read(KEYS.messages, []);
  const full = { ...m, id: `m-${Date.now()}`, read: false, createdAt: Date.now() };
  write(KEYS.messages, [full, ...list]);
}
function markMessageRead(id, value = true) {
  const list = read(KEYS.messages, []);
  write(KEYS.messages, list.map((m) => m.id === id ? { ...m, read: value } : m));
}
function deleteMessage(id) {
  const list = read(KEYS.messages, []);
  write(KEYS.messages, list.filter((m) => m.id !== id));
}
function useContent() {
  return useStore(KEYS.content, DEFAULT_CONTENT);
}
function updateContent(patch) {
  const cur = read(KEYS.content, DEFAULT_CONTENT);
  write(KEYS.content, { ...cur, ...patch });
}
async function fetchBursaryWindowStart() {
  try {
    const { data, error } = await supabase.from("site_settings").select("value").eq("id", "bursary_window").single();
    if (error || !data) return "";
    return data.value ?? "";
  } catch {
    return "";
  }
}
async function saveBursaryWindowStart(dateStr) {
  await supabase.from("site_settings").upsert({ id: "bursary_window", value: dateStr }, { onConflict: "id" });
}
function useBursaryWindow() {
  const [windowStart, setWindowStart] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    fetchBursaryWindowStart().then((v) => {
      setWindowStart(v);
      setLoading(false);
    });
    const ch = supabase.channel("bursary-window-watch").on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_settings" },
      (payload) => {
        const row = payload.new;
        if (row?.id === "bursary_window") setWindowStart(row.value ?? "");
      }
    ).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);
  return { windowStart, loading };
}
function useActivities() {
  return useStore(KEYS.activities, []);
}
function addActivity(a) {
  const list = read(KEYS.activities, []);
  const full = { ...a, id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
  write(KEYS.activities, [full, ...list]);
}
function deleteActivity(id) {
  const list = read(KEYS.activities, []);
  write(KEYS.activities, list.filter((a) => a.id !== id));
}
function filterUpcoming(list) {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return list.filter((a) => {
    const d = new Date(a.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= today.getTime();
  }).sort((a, b) => a.date.localeCompare(b.date));
}
function isAdminAuthed() {
  if (!isBrowser()) return false;
  return localStorage.getItem(KEYS.auth) === "1";
}
function adminLogin(email, password) {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (isBrowser()) {
      localStorage.setItem(KEYS.auth, "1");
      window.dispatchEvent(new CustomEvent("moha-store", { detail: { key: KEYS.auth } }));
    }
    return true;
  }
  return false;
}
function adminLogout() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.auth);
  window.dispatchEvent(new CustomEvent("moha-store", { detail: { key: KEYS.auth } }));
}
function useAdminAuth() {
  const [authed, setAuthed] = reactExports.useState(false);
  const [ready, setReady] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setAuthed(isAdminAuthed());
    setReady(true);
    const h = () => setAuthed(isAdminAuthed());
    window.addEventListener("moha-store", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("moha-store", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return { authed, ready };
}
function normalizeKenyanPhone(raw) {
  const digits = String(raw || "").replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "+254" + digits;
  return digits;
}
async function syncGuardianAsSupporter(input) {
  const phone = normalizeKenyanPhone(input.phone);
  if (!input.name?.trim() || !phone) return;
  try {
    await supabase.from("supporters").upsert(
      {
        name: input.name.trim(),
        phone,
        id_number: input.idNumber?.trim() || "",
        ward: input.ward || null,
        notes: "Auto-added: bursary application guardian"
      },
      { onConflict: "phone" }
    );
  } catch {
  }
}
export {
  MATHARE_WARDS as M,
  adminLogin as a,
  usePolls as b,
  addMessage as c,
  useBursaryWindow as d,
  useBusinesses as e,
  addBusiness as f,
  useActivities as g,
  filterUpcoming as h,
  useMessages as i,
  useAdminAuth as j,
  adminLogout as k,
  usePollVotes as l,
  isAdminAuthed as m,
  markMessageRead as n,
  deleteMessage as o,
  saveBursaryWindowStart as p,
  updateContent as q,
  resetPoll as r,
  syncGuardianAsSupporter as s,
  setBusinessStatus as t,
  useContent as u,
  votePoll as v,
  deleteBusiness as w,
  deleteActivity as x,
  addActivity as y
};
