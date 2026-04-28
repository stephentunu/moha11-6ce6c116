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

export type PollOption = { id: string; label: string; votes: number };
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
  polls: "moha.polls.v1",
  messages: "moha.messages.v1",
  content: "moha.content.v1",
  auth: "moha.admin.session.v1",
} as const;

export const ADMIN_EMAIL = "admin2027@gmail.com";
export const ADMIN_PASSWORD = "moha2027";

const DEFAULT_POLLS: Poll[] = [
  {
    id: "p1",
    question: "What is the #1 issue Mathare needs solved first?",
    options: [
      { id: "a", label: "Youth unemployment", votes: 4820 },
      { id: "b", label: "Drainage & flooding", votes: 3210 },
      { id: "c", label: "Insecurity at night", votes: 2870 },
      { id: "d", label: "Affordable healthcare", votes: 3540 },
    ],
  },
  {
    id: "p2",
    question: "Where should the next youth hub be built?",
    options: [
      { id: "a", label: "Mathare 4A", votes: 1820 },
      { id: "b", label: "Huruma", votes: 2110 },
      { id: "c", label: "Mlango Kubwa", votes: 1560 },
      { id: "d", label: "Hospital Ward", votes: 1340 },
    ],
  },
  {
    id: "p3",
    question: "Which education program should we expand next?",
    options: [
      { id: "a", label: "University tuition fund", votes: 2400 },
      { id: "b", label: "Digital learning labs", votes: 3120 },
      { id: "c", label: "TVET scholarships", votes: 1980 },
      { id: "d", label: "Adult literacy classes", votes: 980 },
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

// ===== Businesses =====
export function useBusinesses() {
  return useStore<Business[]>(KEYS.businesses, []);
}
export function addBusiness(b: Omit<Business, "status" | "createdAt"> & Partial<Pick<Business, "status" | "createdAt">>) {
  const list = read<Business[]>(KEYS.businesses, []);
  const full: Business = {
    status: "active",
    createdAt: Date.now(),
    ...b,
  };
  write(KEYS.businesses, [full, ...list]);
}
export function deleteBusiness(id: string) {
  const list = read<Business[]>(KEYS.businesses, []);
  write(KEYS.businesses, list.filter((b) => b.id !== id));
}
export function setBusinessStatus(id: string, status: Business["status"]) {
  const list = read<Business[]>(KEYS.businesses, []);
  write(KEYS.businesses, list.map((b) => (b.id === id ? { ...b, status } : b)));
}

// ===== Polls =====
export function usePolls() {
  return useStore<Poll[]>(KEYS.polls, DEFAULT_POLLS);
}
export function votePoll(pollId: string, optionId: string) {
  const list = read<Poll[]>(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map((p) =>
      p.id !== pollId
        ? p
        : { ...p, options: p.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)) }
    )
  );
}
export function resetPoll(pollId: string) {
  const list = read<Poll[]>(KEYS.polls, DEFAULT_POLLS);
  write(
    KEYS.polls,
    list.map((p) => (p.id !== pollId ? p : { ...p, options: p.options.map((o) => ({ ...o, votes: 0 })) }))
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
