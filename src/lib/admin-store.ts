// Lightweight localStorage-backed store shared across public pages and admin dashboard.
// Uses a custom event so multiple components in the same tab stay in sync.

import { useEffect, useState } from "react";

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
  status: "active" | "suspended";
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
};

const KEYS = {
  businesses: "moha.businesses.v1",
  polls: "moha.polls.v2",
  pollVotes: "moha.pollVotes.v1",
  messages: "moha.messages.v1",
  content: "moha.content.v1",
  auth: "moha.admin.session.v1",
} as const;

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
      { id: "a", label: "Youth unemployment", votes: 0 },
      { id: "b", label: "Drainage & flooding", votes: 0 },
      { id: "c", label: "Insecurity at night", votes: 0 },
      { id: "d", label: "Affordable healthcare", votes: 0 },
    ],
  },
  {
    id: "p2",
    question: "Where should the next youth hub be built?",
    options: [
      { id: "a", label: "Mathare 4A", votes: 0 },
      { id: "b", label: "Huruma", votes: 0 },
      { id: "c", label: "Mlango Kubwa", votes: 0 },
      { id: "d", label: "Hospital Ward", votes: 0 },
    ],
  },
  {
    id: "p3",
    question: "Which education program should we expand next?",
    options: [
      { id: "a", label: "University tuition fund", votes: 0 },
      { id: "b", label: "Digital learning labs", votes: 0 },
      { id: "c", label: "TVET scholarships", votes: 0 },
      { id: "d", label: "Adult literacy classes", votes: 0 },
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
  foundationsHeadline: "The Moha Foundations",
  foundationsSubtitle: "Real work that does not wait for elections.",
  heroImageUrl: "",
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
import { supabase } from "@/integrations/supabase/client";

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
  status: string;
  created_at: string;
};

function rowToBusiness(r: BusinessRow): Business {
  return {
    id: r.id,
    ownerName: r.owner_name,
    businessName: r.business_name,
    category: r.category,
    ward: r.ward,
    location: r.location,
    phone: r.phone,
    description: r.description,
    imageUrl: r.image_url,
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

    // Realtime sync across devices
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
    image_url: b.imageUrl ?? "",
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
