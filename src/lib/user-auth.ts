// Public user authentication — full name + password, no email or phone
// required. Built for an audience that needs the simplest possible account
// system. Sessions are tracked via a token stored in localStorage and
// validated against the app_sessions table on the server.
//
// Completely separate from admin login (still a fixed email + password pair,
// checked locally — see admin-store.ts).

import { useEffect, useState, useCallback } from "react";
import { simpleSignUp, simpleSignIn, simpleSignOut, validateSession } from "@/lib/simple-auth.functions";

const SESSION_KEY = "moha.user.session.v1";

export type AuthResult = { ok: true } | { ok: false; message: string };

type StoredSession = { token: string; userId: string; fullName: string };

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("moha-user-session"));
}

/** Create a new account with full name + password. */
export async function userSignUp(fullName: string, password: string): Promise<AuthResult> {
  if (!fullName.trim() || fullName.trim().length < 2) {
    return { ok: false, message: "Please enter your full name" };
  }
  if (!password || password.length < 4) {
    return { ok: false, message: "Password must be at least 4 characters" };
  }
  try {
    const res = await simpleSignUp({ data: { fullName, password } });
    writeSession({ token: res.token, userId: res.userId, fullName: res.fullName });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not create account" };
  }
}

/** Sign in with full name + password. */
export async function userSignIn(fullName: string, password: string): Promise<AuthResult> {
  if (!fullName.trim()) return { ok: false, message: "Please enter your name" };
  if (!password) return { ok: false, message: "Please enter your password" };
  try {
    const res = await simpleSignIn({ data: { fullName, password } });
    writeSession({ token: res.token, userId: res.userId, fullName: res.fullName });
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Could not sign in" };
  }
}

/** Sign the current user out. */
export async function userSignOut(): Promise<void> {
  const session = readSession();
  if (session) {
    try { await simpleSignOut({ data: { token: session.token } }); } catch { /* ignore */ }
  }
  writeSession(null);
}

/** React hook: tracks the current session reactively, validating it on load. */
export function useUserAuth() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = readSession();
    if (!stored) {
      setSession(null);
      setLoading(false);
      return;
    }
    try {
      const res = await validateSession({ data: { token: stored.token } });
      if (res.valid) {
        setSession({ token: stored.token, userId: res.userId, fullName: res.fullName });
      } else {
        writeSession(null);
        setSession(null);
      }
    } catch {
      // Network hiccup — keep the locally-stored session optimistically
      setSession(stored);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => { setSession(readSession()); };
    window.addEventListener("moha-user-session", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("moha-user-session", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const signOut = useCallback(async () => {
    await userSignOut();
  }, []);

  return {
    loading,
    isSignedIn: !!session,
    displayName: session?.fullName || "",
    userId: session?.userId || "",
    signOut,
  };
}