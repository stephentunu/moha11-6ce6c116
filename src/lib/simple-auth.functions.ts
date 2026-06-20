// Public user authentication — full name + password only. No email, no
// phone number required. Built for an audience that may find email or
// SMS-OTP flows slower or harder to use; this is the simplest possible
// account system: pick a name, pick a password, done.
//
// Because names are not unique, accounts are looked up by name AND password
// together (like a shared "household" login would work) — two people with
// the same name and the same password are treated as one account, which is
// an acceptable trade-off for this use case. Two people with the same name
// but different passwords get two separate accounts.
//
// Passwords are hashed with PBKDF2 (Node's built-in crypto module, no extra
// dependency needed) before being stored — never saved in plain text.
//
// This is completely separate from admin login, which is untouched and
// still uses the fixed admin email + password pair (see admin-store.ts).
//
// Required SQL (run once in Supabase SQL editor):
//
//   create table if not exists app_users (
//     id uuid primary key default gen_random_uuid(),
//     full_name text not null,
//     name_key text not null,              -- lowercased, trimmed, for lookup
//     password_hash text not null,
//     password_salt text not null,
//     created_at timestamptz not null default now()
//   );
//   create index if not exists app_users_name_key_idx on app_users (name_key);
//   alter table app_users enable row level security;
//   -- No public policies: this table is only touched by server functions
//   -- using the service-role key, never directly from the browser.
//
//   create table if not exists app_sessions (
//     token text primary key,
//     user_id uuid not null references app_users(id) on delete cascade,
//     created_at timestamptz not null default now(),
//     expires_at timestamptz not null
//   );
//   create index if not exists app_sessions_user_id_idx on app_sessions (user_id);
//   alter table app_sessions enable row level security;

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SESSION_TTL_DAYS = 30;

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// ── Sign up ──────────────────────────────────────────────────────────────────

const SignUpSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  password: z.string().min(4).max(100),
});

export const simpleSignUp = createServerFn({ method: "POST" })
  .inputValidator((d) => SignUpSchema.parse(d))
  .handler(async ({ data }) => {
    const fullName = data.fullName.trim();
    const nameKey = normalizeName(fullName);

    // Check if this exact name + password combination already exists
    const { data: existingRows } = await supabaseAdmin
      .from("app_users" as never)
      .select("id, password_hash, password_salt")
      .eq("name_key" as never, nameKey);

    const existing = existingRows as unknown as
      { id: string; password_hash: string; password_salt: string }[] | null;

    if (existing && existing.length > 0) {
      // A user with this name already exists — check if any match the password
      for (const row of existing) {
        const computed = hashPassword(data.password, row.password_salt);
        if (computed === row.password_hash) {
          // Same name + same password = same person signing up again. Just log them in.
          return createSession(row.id);
        }
      }
      // Name exists but password doesn't match any existing account for that name
      throw new Error(
        "An account with this name already exists with a different password. Please sign in instead, or use a slightly different name (e.g. add your second name)."
      );
    }

    // Brand new account
    const salt = generateSalt();
    const passwordHash = hashPassword(data.password, salt);

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("app_users" as never)
      .insert({ full_name: fullName, name_key: nameKey, password_hash: passwordHash, password_salt: salt } as never)
      .select("id")
      .single();

    if (insertError || !inserted) {
      throw new Error("Could not create account. Please try again.");
    }

    const userId = (inserted as unknown as { id: string }).id;
    return createSession(userId);
  });

// ── Sign in ──────────────────────────────────────────────────────────────────

const SignInSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  password: z.string().min(1).max(100),
});

export const simpleSignIn = createServerFn({ method: "POST" })
  .inputValidator((d) => SignInSchema.parse(d))
  .handler(async ({ data }) => {
    const nameKey = normalizeName(data.fullName);

    const { data: rows, error } = await supabaseAdmin
      .from("app_users" as never)
      .select("id, password_hash, password_salt")
      .eq("name_key" as never, nameKey);

    if (error) throw new Error("Could not sign in. Please try again.");

    const matches = rows as unknown as { id: string; password_hash: string; password_salt: string }[] | null;
    if (!matches || matches.length === 0) {
      throw new Error("No account found with that name. Please check your spelling or create an account.");
    }

    for (const row of matches) {
      const computed = hashPassword(data.password, row.password_salt);
      if (computed === row.password_hash) {
        return createSession(row.id);
      }
    }

    throw new Error("Incorrect password. Please try again.");
  });

// ── Session helpers ──────────────────────────────────────────────────────────

async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60_000).toISOString();

  const { error } = await supabaseAdmin
    .from("app_sessions" as never)
    .insert({ token, user_id: userId, expires_at: expiresAt } as never);
  if (error) throw new Error("Could not start session. Please try again.");

  const { data: userRow } = await supabaseAdmin
    .from("app_users" as never)
    .select("id, full_name")
    .eq("id" as never, userId)
    .single();
  const user = userRow as unknown as { id: string; full_name: string } | null;

  return { ok: true as const, token, userId, fullName: user?.full_name ?? "" };
}

// ── Validate / refresh a session ─────────────────────────────────────────────

const ValidateSchema = z.object({ token: z.string().min(10) });

export const validateSession = createServerFn({ method: "POST" })
  .inputValidator((d) => ValidateSchema.parse(d))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from("app_sessions" as never)
      .select("user_id, expires_at")
      .eq("token" as never, data.token)
      .single();

    if (error || !rows) return { valid: false as const };

    const row = rows as unknown as { user_id: string; expires_at: string };
    if (new Date(row.expires_at).getTime() < Date.now()) {
      // Expired — clean it up
      await supabaseAdmin.from("app_sessions" as never).delete().eq("token" as never, data.token);
      return { valid: false as const };
    }

    const { data: userRow } = await supabaseAdmin
      .from("app_users" as never)
      .select("id, full_name")
      .eq("id" as never, row.user_id)
      .single();
    const user = userRow as unknown as { id: string; full_name: string } | null;
    if (!user) return { valid: false as const };

    return { valid: true as const, userId: user.id, fullName: user.full_name };
  });

// ── Sign out ─────────────────────────────────────────────────────────────────

const SignOutSchema = z.object({ token: z.string().min(10) });

export const simpleSignOut = createServerFn({ method: "POST" })
  .inputValidator((d) => SignOutSchema.parse(d))
  .handler(async ({ data }) => {
    await supabaseAdmin.from("app_sessions" as never).delete().eq("token" as never, data.token);
    return { ok: true };
  });