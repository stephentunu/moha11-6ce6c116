// Lightweight localStorage-backed store shared across public pages and admin dashboard.
// Uses a custom event so multiple components in the same tab stay in sync.

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type PaymentMethod = "send_money" | "pochi" | "till" | "paybill" | "cash";

export type Business = {
  id: string;
  ownerName: string;
  businessName: string;
  category: string;
  ward: string;
  location: string;
  phone: string;
  description: string;
  imageUrl: string;
  imageUrls: string[];
  websiteUrl?: string;
  street?: string;
  contacts?: string;
  paymentMethods: PaymentMethod[];
  tillPaybillNumber?: string;
  nearestTransport?: string;
  deliveryAvailable: boolean;
  status: "active" | "suspended";
  createdAt: number;
};

export type BursaryApplication = {
  id: string;
  reference: string;
  studentName: string;
  dob: string | null;
  gender: string | null;
  idOrBirthCertNumber: string | null;
  phone: string | null;
  schoolName: string;
  currentGrade: string;
  kcseYear: string | null;
  guardianName: string;
  guardianPhone: string;
  ward: string | null;
  residenceEstate: string | null;
  householdIncomeBand: string | null;
  siblingsInSchool: number;
  amountRequested: number;
  reason: string | null;
  supportingDocUrl: string | null;
  status: "pending" | "reviewing" | "approved" | "rejected";
  adminNotes: string | null;
  smsLastSentAt: string | null;
  smsLastMessage: string | null;
  createdAt: number;
};

export type PollOption = { id: string; label: string; votes: number; votesByWard?: Record<string, number> };
export type Poll = { id: string; question: string; options: PollOption[] };

export type Message = {
  id: string;
  kind: "opinion" | "ask";
  name: string;
  contact: string; // ward (opinion) or phone/email (ask)
  body: string;
  read: boolean;
  createdAt: number;
};

export type SiteContent = {
  homeHeadline: string;
  homeTagline: string;
  homeQuote: string;
  homeQuoteAuthor: string;
  prioritiesHeadline: string;
  prioritiesSubtitle: string;
  foundationsHeadline: string;
  foundationsSubtitle: string;
  heroImageUrl: string;
  /** ISO date string (YYYY-MM-DD) when the bursary window opens. Empty = closed. */
  bursaryWindowStart: string;
};

const KEYS = {
  businesses: "moha.businesses.v1",
  polls: "moha.polls.v4",
  pollVotes: "moha.pollVotes.v1",
  messages: "moha.messages.v1",
  content: "moha.content.v1",
  auth: "moha.admin.session.v1",
  activities: "moha.activities.v1",
} as const;

export type Activity = {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time?: string; // optional HH:MM
  location?: string;
  ward?: string;
};

export type PollVote = {
  id: string;
  pollId: string;
  optionId: string;
  ward?: string;
  createdAt: number;
};

export const MATHARE_WARDS = [
  "Mabatini",
  "Huruma",
  "Hospital",
  "Kiamaiko",
  "Ngei",
  "Mlango Kubwa",
] as const;

export const ADMIN_EMAIL = "admin2027@gmail.com";
export const ADMIN_PASSWORD = "moha2027";

const DEFAULT_POLLS: Poll[] = [
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
      { id: "g", label: "Youth unemployment", votes: 0 },
    ],
  },
  // Service rating polls (Best / Fairly / Worst) — replaces the old Youth Hub poll.
  ...(["Education", "Health", "Security", "Business Support", "All Services Overall", "Other (None of the above)"].map(
    (svc, i) => ({
      id: `p_svc_${i}`,
      question: `How do you rate Moha's delivery on ${svc}?`,
      options: [
        { id: "best", label: "Best", votes: 0 },
        { id: "fair", label: "Fairly", votes: 0 },
        { id: "worst", label: "Worst", votes: 0 },
      ],
    }),
  ) as Poll[]),
  {
    id: "p3",
    question: "Which education program should we expand next?",
    options: [
      { id: "a", label: "University tuition fund", votes: 0 },
      { id: "b", label: "Digital learning labs", votes: 0 },
      { id: "c", label: "TVET scholarships", votes: 0 },
      { id: "d", label: "Adult literacy classes", votes: 0 },
      { id: "e", label: "High school Bursaries and scholarships", votes: 0 },
    ],
  },
  {
    id: "p4",
    question: "How strongly do you agree with Moha's initiatives & projects in Mathare?",
    options: [
      { id: "a", label: "Strongly agree", votes: 0 },
      { id: "b", label: "Agree", votes: 0 },
      { id: "c", label: "Neutral", votes: 0 },
      { id: "d", label: "Disagree", votes: 0 },
      { id: "e", label: "Strongly disagree", votes: 0 },
    ],
  },
  {
    id: "p5",
    question: "Is Moha the best candidate for Mathare MP in 2027?",
    options: [
      { id: "a", label: "Yes — he's the best option", votes: 0 },
      { id: "b", label: "Likely yes", votes: 0 },
      { id: "c", label: "Undecided", votes: 0 },
      { id: "d", label: "Likely no", votes: 0 },
      { id: "e", label: "No", votes: 0 },
    ],
  },
];

const DEFAULT_CONTENT: SiteContent = {
  homeHeadline: "Moha Delivers.",
  homeTagline: "Kuna More na Moha!",
  homeQuote:
    "Mathare raised me. Now it's my turn to raise Mathare. We don't need promises — we need delivery.",
  homeQuoteAuthor: "Moha",
  prioritiesHeadline: "Our Priorities",
  prioritiesSubtitle: "Education, Health, Business, Environment.",
  foundationsHeadline: "The Moha Foundation",
  foundationsSubtitle: "Real work that does not wait for elections.",
  heroImageUrl: "",
  bursaryWindowStart: "",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("moha-store", { detail: { key } }));
  } catch {
    /* ignore */
  }
}

function useStore<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    setValue(read(key, fallback));
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ key: string }>;
      if (!ce.detail || ce.detail.key === key) setValue(read(key, fallback));
    };
    window.addEventListener("moha-store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("moha-store", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (v: T | ((p: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
      write(key, next);
      return next;
    });
  };

  return [value, update];
}

// ===== Businesses (backed by Supabase) =====

type BusinessRow = {
  id: string;
  owner_name: string;
  business_name: string;
  category: string;
  ward: string;
  location: string;
  phone: string;
  description: string;
  image_url: string;
  image_urls: string[] | null;
  website_url: string | null;
  street: string | null;
  contacts: string | null;
  payment_methods: string[] | null;
  till_paybill_number: string | null;
  nearest_transport: string | null;
  delivery_available: boolean | null;
  status: string;
  created_at: string;
};

function rowToBusiness(r: BusinessRow): Business {
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
    websiteUrl: r.website_url ?? undefined,
    street: r.street ?? undefined,
    contacts: r.contacts ?? undefined,
    paymentMethods: (r.payment_methods ?? []) as PaymentMethod[],
    tillPaybillNumber: r.till_paybill_number ?? undefined,
    nearestTransport: r.nearest_transport ?? undefined,
    deliveryAvailable: Boolean(r.delivery_available),
    status: (r.status === "suspended" ? "suspended" : "active") as Business["status"],
    createdAt: new Date(r.created_at).getTime(),
  };
}

const BUSINESS_EVENT = "moha-businesses";

function emitBusinessChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(BUSINESS_EVENT));
}

export function useBusinesses(): [Business[], (v: Business[]) => void] {
  const [list, setList] = useState<Business[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("businesses" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (!cancelled && !error && data) {
        setList((data as unknown as BusinessRow[]).map(rowToBusiness));
      }
    };
    load();
    const handler = () => load();
    window.addEventListener(BUSINESS_EVENT, handler);

    const channel = supabase
      .channel("businesses-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "businesses" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      window.removeEventListener(BUSINESS_EVENT, handler);
      supabase.removeChannel(channel);
    };
  }, []);

  return [list, setList];
}

export async function addBusiness(
  b: Omit<Business, "status" | "createdAt"> & Partial<Pick<Business, "status" | "createdAt">>
) {
  const { error } = await supabase.from("businesses" as never).insert({
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
    status: b.status ?? "active",
  } as never);
  if (error) throw error;
  emitBusinessChange();
}

export async function deleteBusiness(id: string) {
  const { error } = await supabase.from("businesses" as never).delete().eq("id", id);
  if (error) throw error;
  emitBusinessChange();
}

export async function setBusinessStatus(id: string, status: Business["status"]) {
  const { error } = await supabase
    .from("businesses" as never)
    .update({ status } as never)
    .eq("id", id);
  if (error) throw error;
  emitBusinessChange();
}

// ===== Polls =====
export function usePolls() {
  return useStore<Poll[]>(KEYS.polls, DEFAULT_POLLS);
}
export function usePollVotes() {
  return useStore<PollVote[]>(KEYS.pollVotes, []);
}
export function votePoll(pollId: string, optionId: string, ward?: string) {
  const list = read<Poll[]>(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map((p) =>
      p.id !== pollId
        ? p
        : {
            ...p,
            options: p.options.map((o) => {
              if (o.id !== optionId) return o;
              const byWard = { ...(o.votesByWard ?? {}) };
              if (ward) byWard[ward] = (byWard[ward] ?? 0) + 1;
              return { ...o, votes: o.votes + 1, votesByWard: byWard };
            }),
          }
    )
  );
  // Append vote log entry with timestamp
  const log = read<PollVote[]>(KEYS.pollVotes, []);
  const entry: PollVote = {
    id: `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    pollId,
    optionId,
    ward,
    createdAt: Date.now(),
  };
  write(KEYS.pollVotes, [entry, ...log].slice(0, 1000));
}
export function resetPoll(pollId: string) {
  const list = read<Poll[]>(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map((p) =>
      p.id !== pollId
        ? p
        : { ...p, options: p.options.map((o) => ({ ...o, votes: 0, votesByWard: {} })) }
    )
  );
  const log = read<PollVote[]>(KEYS.pollVotes, []);
  write(KEYS.pollVotes, log.filter((v) => v.pollId !== pollId));
}

// ===== Messages =====
export function useMessages() {
  return useStore<Message[]>(KEYS.messages, []);
}
export function addMessage(m: Omit<Message, "id" | "read" | "createdAt">) {
  const list = read<Message[]>(KEYS.messages, []);
  const full: Message = { ...m, id: `m-${Date.now()}`, read: false, createdAt: Date.now() };
  write(KEYS.messages, [full, ...list]);
}
export function markMessageRead(id: string, value = true) {
  const list = read<Message[]>(KEYS.messages, []);
  write(KEYS.messages, list.map((m) => (m.id === id ? { ...m, read: value } : m)));
}
export function deleteMessage(id: string) {
  const list = read<Message[]>(KEYS.messages, []);
  write(KEYS.messages, list.filter((m) => m.id !== id));
}

// ===== Content =====
export function useContent() {
  return useStore<SiteContent>(KEYS.content, DEFAULT_CONTENT);
}
export function updateContent(patch: Partial<SiteContent>) {
  const cur = read<SiteContent>(KEYS.content, DEFAULT_CONTENT);
  write(KEYS.content, { ...cur, ...patch });
}

// ===== Bursary Window — Supabase-backed so ALL devices see the same value =====
//
// Reads from / writes to a `site_settings` table with a single row:
//   id = 'bursary_window'
//   value = ISO date string (YYYY-MM-DD) or empty string
//
// SQL to create the table (run once in Supabase SQL editor):
//
//   create table if not exists site_settings (
//     id text primary key,
//     value text not null default ''
//   );
//   insert into site_settings (id, value) values ('bursary_window', '')
//   on conflict (id) do nothing;
//   -- Customizable window length in days (defaults to 10 if this row is
//   -- absent — see DEFAULT_BURSARY_WINDOW_DURATION_DAYS below):
//   insert into site_settings (id, value) values ('bursary_window_duration', '10')
//   on conflict (id) do nothing;
//   -- Allow public read (no auth needed for the public site):
//   alter table site_settings enable row level security;
//   create policy "public read" on site_settings for select using (true);
//   create policy "admin write" on site_settings for all using (true) with check (true);

/** Read the bursary window start date from Supabase. Returns "" if not set. */
export async function fetchBursaryWindowStart(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("site_settings" as never)
      .select("value")
      .eq("id", "bursary_window")
      .single();
    if (error || !data) return "";
    return (data as unknown as { value: string }).value ?? "";
  } catch {
    return "";
  }
}

/** Save the bursary window start date to Supabase (admin only). */
export async function saveBursaryWindowStart(dateStr: string): Promise<void> {
  await supabase
    .from("site_settings" as never)
    .upsert({ id: "bursary_window", value: dateStr } as never, { onConflict: "id" } as never);
}

// How many days an application window stays open after its start date. Used
// to default existing windows (set before this was configurable) to the
// original fixed behaviour, and as the fallback if the setting is missing.
export const DEFAULT_BURSARY_WINDOW_DURATION_DAYS = 10;

/** Read the configured window duration (days) from Supabase. Falls back to
 *  DEFAULT_BURSARY_WINDOW_DURATION_DAYS if not set or invalid. */
export async function fetchBursaryWindowDuration(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("site_settings" as never)
      .select("value")
      .eq("id", "bursary_window_duration")
      .single();
    if (error || !data) return DEFAULT_BURSARY_WINDOW_DURATION_DAYS;
    const n = parseInt((data as unknown as { value: string }).value ?? "", 10);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_BURSARY_WINDOW_DURATION_DAYS;
  } catch {
    return DEFAULT_BURSARY_WINDOW_DURATION_DAYS;
  }
}

/** Save the window duration (days) to Supabase (admin only). */
export async function saveBursaryWindowDuration(days: number): Promise<void> {
  const clamped = Number.isFinite(days) && days > 0 ? Math.round(days) : DEFAULT_BURSARY_WINDOW_DURATION_DAYS;
  await supabase
    .from("site_settings" as never)
    .upsert({ id: "bursary_window_duration", value: String(clamped) } as never, { onConflict: "id" } as never);
}

/** React hook: subscribes to the bursary window start + duration from
 *  Supabase in real-time (single shared channel for both settings). */
export function useBursaryWindow() {
  const [windowStart, setWindowStart] = useState<string>("");
  const [windowDurationDays, setWindowDurationDays] = useState<number>(DEFAULT_BURSARY_WINDOW_DURATION_DAYS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    Promise.all([fetchBursaryWindowStart(), fetchBursaryWindowDuration()]).then(
      ([start, duration]) => {
        setWindowStart(start);
        setWindowDurationDays(duration);
        setLoading(false);
      }
    );

    // Real-time subscription — any device saving triggers an update here too
    const ch = supabase
      .channel("bursary-window-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          const row = payload.new as { id: string; value: string } | null;
          if (row?.id === "bursary_window") setWindowStart(row.value ?? "");
          if (row?.id === "bursary_window_duration") {
            const n = parseInt(row.value ?? "", 10);
            setWindowDurationDays(Number.isFinite(n) && n > 0 ? n : DEFAULT_BURSARY_WINDOW_DURATION_DAYS);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  return { windowStart, windowDurationDays, loading };
}

// ===== Bursary Term (which "window" applications are currently attached to) ==
//
// Stored the same way as the bursary window (a row in `site_settings`, id =
// 'bursary_term'). This is the label an admin picks (e.g. "Term 1 - 2026")
// whenever they open a new application window. Every application submitted
// from that point on is stamped with this exact label, which is what lets
// the admin dashboard show "this term's" applications by default while still
// being able to look back at any previous term's applications on demand —
// without ever having to physically move any data.

export const TERM_NAMES = ["Term 1", "Term 2", "Term 3"] as const;
export type TermName = (typeof TERM_NAMES)[number];

/** Build the canonical stored label for a term name + year, e.g. "Term 2 - 2026". */
export function buildTermLabel(termName: string, year: number | string): string {
  return `${termName} - ${year}`;
}

/** Split a stored term label like "Term 2 - 2026" back into its parts. Best-effort. */
export function parseTermLabel(label: string): { termName: string; year: string } {
  const m = /^(.*?)\s*-\s*(\d{4})$/.exec(label.trim());
  if (m) return { termName: m[1], year: m[2] };
  return { termName: label, year: "" };
}

/** Read the currently-open term label from Supabase. Returns "" if not set. */
export async function fetchBursaryTerm(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("site_settings" as never)
      .select("value")
      .eq("id", "bursary_term")
      .single();
    if (error || !data) return "";
    return (data as unknown as { value: string }).value ?? "";
  } catch {
    return "";
  }
}

/** Save the currently-open term label to Supabase (admin only). */
export async function saveBursaryTerm(label: string): Promise<void> {
  const { error } = await supabase
    .from("site_settings" as never)
    .upsert({ id: "bursary_term", value: label } as never, { onConflict: "id" } as never);
  if (error) throw error;
}

/** React hook: subscribes to the currently-open term label in real-time. */
export function useBursaryTerm() {
  const [term, setTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBursaryTerm().then((v) => { setTerm(v); setLoading(false); });

    const ch = supabase
      .channel("bursary-term-watch")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        (payload) => {
          const row = payload.new as { id: string; value: string } | null;
          if (row?.id === "bursary_term") setTerm(row.value ?? "");
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, []);

  return { term, loading };
}

// ===== School Confirmation Letter tracking =====
//
// Once an admin downloads a school's confirmation letter for a given term,
// that school drops off the active "School Confirmation Letters" picker for
// that term and shows up (with a "Letter sent" badge) in the Schools tab
// instead, where it can be archived — or simply restored back onto the
// active letters list if it was marked by mistake.

/** Fetch every (school, term) pair that already had a letter generated. Keyed as "school||term". */
export async function fetchGeneratedLetterSchools(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("school_letters_generated" as never)
    .select("school_name, term");
  if (error || !data) return new Set();
  return new Set(
    (data as unknown as { school_name: string; term: string }[]).map((r) => `${r.school_name}||${r.term}`),
  );
}

/** Record that a school's confirmation letter was just generated for a term. */
export async function markLetterGenerated(schoolName: string, term: string): Promise<void> {
  const { error } = await supabase
    .from("school_letters_generated" as never)
    .upsert({ school_name: schoolName, term } as never, { onConflict: "school_name,term" } as never);
  if (error) throw error;
}

/** Undo markLetterGenerated — puts the school back on the active letters list for that term. */
export async function unmarkLetterGenerated(schoolName: string, term: string): Promise<void> {
  const { error } = await supabase
    .from("school_letters_generated" as never)
    .delete()
    .eq("school_name", schoolName)
    .eq("term", term);
  if (error) throw error;
}

// ===== Archived Schools =====
//
// A school is just a free-text name that shows up on one or more bursary
// applications — there's no normalized `schools` table. Archiving a school
// simply records its (upper-cased, canonical) name in `archived_schools`.
// Archived schools are hidden from the active school pickers (Review by
// Location, Confirmation Letters) until unarchived.

/** Fetch the set of currently archived school names (already upper-cased). */
export async function fetchArchivedSchools(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("archived_schools" as never)
    .select("school_name");
  if (error || !data) return new Set();
  return new Set((data as unknown as { school_name: string }[]).map((r) => r.school_name));
}

/** Archive one or more schools by name (upsert — safe to call on already-archived names). */
export async function archiveSchools(schoolNames: string[]): Promise<void> {
  if (schoolNames.length === 0) return;
  const { error } = await supabase
    .from("archived_schools" as never)
    .upsert(schoolNames.map((school_name) => ({ school_name })) as never, { onConflict: "school_name" } as never);
  if (error) throw error;
}

/** Unarchive one or more schools by name. */
export async function unarchiveSchools(schoolNames: string[]): Promise<void> {
  if (schoolNames.length === 0) return;
  const { error } = await supabase
    .from("archived_schools" as never)
    .delete()
    .in("school_name", schoolNames);
  if (error) throw error;
}

// ===== Activities =====
export function useActivities() {
  return useStore<Activity[]>(KEYS.activities, []);
}
export function addActivity(a: Omit<Activity, "id">) {
  const list = read<Activity[]>(KEYS.activities, []);
  const full: Activity = { ...a, id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` };
  write(KEYS.activities, [full, ...list]);
}
export function updateActivity(id: string, patch: Partial<Activity>) {
  const list = read<Activity[]>(KEYS.activities, []);
  write(KEYS.activities, list.map((a) => (a.id === id ? { ...a, ...patch } : a)));
}
export function deleteActivity(id: string) {
  const list = read<Activity[]>(KEYS.activities, []);
  write(KEYS.activities, list.filter((a) => a.id !== id));
}
/** Returns activities whose date is today or in the future, sorted by date asc. */
export function filterUpcoming(list: Activity[]): Activity[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return list
    .filter((a) => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() >= today.getTime();
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ===== Auth =====
export function isAdminAuthed(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(KEYS.auth) === "1";
}
export function adminLogin(email: string, password: string): boolean {
  if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    if (isBrowser()) {
      localStorage.setItem(KEYS.auth, "1");
      window.dispatchEvent(new CustomEvent("moha-store", { detail: { key: KEYS.auth } }));
    }
    return true;
  }
  return false;
}
export function adminLogout() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.auth);
  window.dispatchEvent(new CustomEvent("moha-store", { detail: { key: KEYS.auth } }));
}
export function useAdminAuth() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
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

// ===== Bursary Applications (Supabase-backed) =====
type BursaryRow = {
  id: string;
  reference: string;
  student_name: string;
  dob: string | null;
  gender: string | null;
  id_or_birth_cert_number: string | null;
  phone: string | null;
  school_name: string;
  current_grade: string;
  kcse_year: string | null;
  guardian_name: string;
  guardian_phone: string;
  ward: string | null;
  residence_estate: string | null;
  household_income_band: string | null;
  siblings_in_school: number | null;
  amount_requested: number | null;
  reason: string | null;
  supporting_doc_url: string | null;
  status: string;
  admin_notes: string | null;
  sms_last_sent_at: string | null;
  sms_last_message: string | null;
  created_at: string;
};

function rowToBursary(r: BursaryRow): BursaryApplication {
  return {
    id: r.id,
    reference: r.reference,
    studentName: r.student_name,
    dob: r.dob,
    gender: r.gender,
    idOrBirthCertNumber: r.id_or_birth_cert_number,
    phone: r.phone,
    schoolName: r.school_name,
    currentGrade: r.current_grade,
    kcseYear: r.kcse_year,
    guardianName: r.guardian_name,
    guardianPhone: r.guardian_phone,
    ward: r.ward,
    residenceEstate: r.residence_estate,
    householdIncomeBand: r.household_income_band,
    siblingsInSchool: r.siblings_in_school ?? 0,
    amountRequested: Number(r.amount_requested ?? 0),
    reason: r.reason,
    supportingDocUrl: r.supporting_doc_url,
    status: (["pending", "reviewing", "approved", "rejected"].includes(r.status)
      ? r.status
      : "pending") as BursaryApplication["status"],
    adminNotes: r.admin_notes,
    smsLastSentAt: r.sms_last_sent_at,
    smsLastMessage: r.sms_last_message,
    createdAt: new Date(r.created_at).getTime(),
  };
}

const BURSARY_EVENT = "moha-bursaries";
function emitBursaryChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent(BURSARY_EVENT));
}

export function useBursaryApplications(): [BursaryApplication[], () => void] {
  const [list, setList] = useState<BursaryApplication[]>([]);
  const reload = () => emitBursaryChange();
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("bursary_applications" as never)
        .select("*")
        .order("created_at", { ascending: false });
      if (!cancelled && !error && data) {
        setList((data as unknown as BursaryRow[]).map(rowToBursary));
      }
    };
    load();
    const handler = () => load();
    window.addEventListener(BURSARY_EVENT, handler);
    const channel = supabase
      .channel("bursaries-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bursary_applications" },
        () => load()
      )
      .subscribe();
    return () => {
      cancelled = true;
      window.removeEventListener(BURSARY_EVENT, handler);
      supabase.removeChannel(channel);
    };
  }, []);
  return [list, reload];
}

export type BursaryInput = Omit<BursaryApplication, "id" | "reference" | "status" | "adminNotes" | "smsLastSentAt" | "smsLastMessage" | "createdAt">;

export async function addBursaryApplication(b: BursaryInput): Promise<{ reference: string }> {
  const { data, error } = await supabase
    .from("bursary_applications" as never)
    .insert({
      student_name: b.studentName,
      dob: b.dob || null,
      gender: b.gender,
      id_or_birth_cert_number: b.idOrBirthCertNumber,
      phone: b.phone,
      school_name: b.schoolName,
      current_grade: b.currentGrade,
      kcse_year: b.kcseYear,
      guardian_name: b.guardianName,
      guardian_phone: b.guardianPhone,
      ward: b.ward,
      residence_estate: b.residenceEstate,
      household_income_band: b.householdIncomeBand,
      siblings_in_school: b.siblingsInSchool,
      amount_requested: b.amountRequested,
      reason: b.reason,
      supporting_doc_url: b.supportingDocUrl,
    } as never)
    .select("reference")
    .single();
  if (error) throw error;
  emitBursaryChange();
  return { reference: (data as unknown as { reference: string }).reference };
}

export async function setBursaryStatus(id: string, status: BursaryApplication["status"], notes?: string) {
  const patch: Record<string, unknown> = { status };
  if (notes !== undefined) patch.admin_notes = notes;
  const { error } = await supabase.from("bursary_applications" as never).update(patch as never).eq("id", id);
  if (error) throw error;
  emitBursaryChange();
}

export async function logBursarySms(id: string, message: string) {
  const { error } = await supabase
    .from("bursary_applications" as never)
    .update({ sms_last_sent_at: new Date().toISOString(), sms_last_message: message } as never)
    .eq("id", id);
  if (error) throw error;
  emitBursaryChange();
}

export async function deleteBursaryApplication(id: string) {
  const { error } = await supabase.from("bursary_applications" as never).delete().eq("id", id);
  if (error) throw error;
  emitBursaryChange();
}

// ===== Guardian → Supporter sync =====
//
// Every parent/guardian who submits a bursary application is automatically
// added to the Supporters list — they've already shown trust and engagement
// with Moha's work, so they belong in the supporter base. Uses the exact
// same phone-normalization convention as the Supporters admin page, and
// upserts on phone number so re-applying (e.g. a second child) doesn't
// create duplicate supporter records.

function normalizeKenyanPhone(raw: string): string {
  const digits = String(raw || "").replace(/[^\d+]/g, "");
  if (!digits) return "";
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9 && digits.startsWith("7")) return "+254" + digits;
  return digits;
}

export async function syncGuardianAsSupporter(input: {
  name: string;
  phone: string;
  idNumber?: string | null;
  ward?: string | null;
}) {
  const phone = normalizeKenyanPhone(input.phone);
  if (!input.name?.trim() || !phone) return; // skip silently — not enough data to create a supporter record

  try {
    await supabase.from("supporters" as never).upsert(
      {
        name: input.name.trim(),
        phone,
        id_number: input.idNumber?.trim() || "",
        ward: input.ward || null,
        notes: "Auto-added: bursary application guardian",
      } as never,
      { onConflict: "phone" } as never,
    );
  } catch {
    // Never let a supporter-sync failure block or surface an error during
    // bursary submission — this is a best-effort background action.
  }
}