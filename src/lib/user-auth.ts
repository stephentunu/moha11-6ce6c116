// Public user authentication — powered by Supabase Auth (email + password).
// Completely separate from the admin login (which uses a fixed local credential
// pair and localStorage). This is for regular site visitors who need an account
// to apply for a bursary or list a business on the Advertise page.

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AuthResult = { ok: true } | { ok: false; message: string };

/** Sign up a new user with email + password. */
export async function userSignUp(email: string, password: string, fullName: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) return { ok: false, message: "Email and password are required" };
  if (password.length < 6) return { ok: false, message: "Password must be at least 6 characters" };

  const redirectUrl = typeof window !== "undefined" ? `${window.location.origin}/` : undefined;

  const { error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: { full_name: fullName.trim() },
      emailRedirectTo: redirectUrl,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
      return { ok: false, message: "An account with this email already exists. Please sign in instead." };
    }
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

/** Sign in an existing user with email + password. */
export async function userSignIn(email: string, password: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) return { ok: false, message: "Email and password are required" };

  const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      return { ok: false, message: "Incorrect email or password" };
    }
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { ok: false, message: "Please confirm your email before signing in. Check your inbox." };
    }
    return { ok: false, message: error.message };
  }
  return { ok: true };
}

/** Sign the current user out. */
export async function userSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** React hook: tracks the current Supabase Auth session reactively. */
export function useUserAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await userSignOut();
  }, []);

  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "";

  return {
    session,
    user,
    loading,
    isSignedIn: !!user,
    displayName,
    signOut,
  };
}