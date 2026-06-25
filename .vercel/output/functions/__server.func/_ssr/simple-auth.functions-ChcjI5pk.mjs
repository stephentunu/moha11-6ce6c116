import { c as createServerRpc, s as supabaseAdmin } from "./client.server-Jc0f1I7d.mjs";
import crypto from "node:crypto";
import { c as createServerFn } from "./index.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const SESSION_TTL_DAYS = 30;
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
}
function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
const SignUpSchema = objectType({
  fullName: stringType().trim().min(2).max(100),
  password: stringType().min(4).max(100)
});
const simpleSignUp_createServerFn_handler = createServerRpc({
  id: "91470433042195b042731f475f5e0bf41b319f444101ffebc960505bee251237",
  name: "simpleSignUp",
  filename: "src/lib/simple-auth.functions.ts"
}, (opts) => simpleSignUp.__executeServer(opts));
const simpleSignUp = createServerFn({
  method: "POST"
}).inputValidator((d) => SignUpSchema.parse(d)).handler(simpleSignUp_createServerFn_handler, async ({
  data
}) => {
  const fullName = data.fullName.trim();
  const nameKey = normalizeName(fullName);
  const {
    data: existingRows
  } = await supabaseAdmin.from("app_users").select("id, password_hash, password_salt").eq("name_key", nameKey);
  const existing = existingRows;
  if (existing && existing.length > 0) {
    for (const row of existing) {
      const computed = hashPassword(data.password, row.password_salt);
      if (computed === row.password_hash) {
        return createSession(row.id);
      }
    }
    throw new Error("An account with this name already exists with a different password. Please sign in instead, or use a slightly different name (e.g. add your second name).");
  }
  const salt = generateSalt();
  const passwordHash = hashPassword(data.password, salt);
  const {
    data: inserted,
    error: insertError
  } = await supabaseAdmin.from("app_users").insert({
    full_name: fullName,
    name_key: nameKey,
    password_hash: passwordHash,
    password_salt: salt
  }).select("id").single();
  if (insertError || !inserted) {
    throw new Error("Could not create account. Please try again.");
  }
  const userId = inserted.id;
  return createSession(userId);
});
const SignInSchema = objectType({
  fullName: stringType().trim().min(2).max(100),
  password: stringType().min(1).max(100)
});
const simpleSignIn_createServerFn_handler = createServerRpc({
  id: "629de4d32d45e43757545161a70c3bae7f7d9e46f5b35000932ec239a7baf732",
  name: "simpleSignIn",
  filename: "src/lib/simple-auth.functions.ts"
}, (opts) => simpleSignIn.__executeServer(opts));
const simpleSignIn = createServerFn({
  method: "POST"
}).inputValidator((d) => SignInSchema.parse(d)).handler(simpleSignIn_createServerFn_handler, async ({
  data
}) => {
  const nameKey = normalizeName(data.fullName);
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("app_users").select("id, password_hash, password_salt").eq("name_key", nameKey);
  if (error) throw new Error("Could not sign in. Please try again.");
  const matches = rows;
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
async function createSession(userId) {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 6e4).toISOString();
  const {
    error
  } = await supabaseAdmin.from("app_sessions").insert({
    token,
    user_id: userId,
    expires_at: expiresAt
  });
  if (error) throw new Error("Could not start session. Please try again.");
  const {
    data: userRow
  } = await supabaseAdmin.from("app_users").select("id, full_name").eq("id", userId).single();
  const user = userRow;
  return {
    ok: true,
    token,
    userId,
    fullName: user?.full_name ?? ""
  };
}
const ValidateSchema = objectType({
  token: stringType().min(10)
});
const validateSession_createServerFn_handler = createServerRpc({
  id: "1bead37f43c67904514299ecab03298164d39c52f096ee6c7e44fafecda291d5",
  name: "validateSession",
  filename: "src/lib/simple-auth.functions.ts"
}, (opts) => validateSession.__executeServer(opts));
const validateSession = createServerFn({
  method: "POST"
}).inputValidator((d) => ValidateSchema.parse(d)).handler(validateSession_createServerFn_handler, async ({
  data
}) => {
  const {
    data: rows,
    error
  } = await supabaseAdmin.from("app_sessions").select("user_id, expires_at").eq("token", data.token).single();
  if (error || !rows) return {
    valid: false
  };
  const row = rows;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await supabaseAdmin.from("app_sessions").delete().eq("token", data.token);
    return {
      valid: false
    };
  }
  const {
    data: userRow
  } = await supabaseAdmin.from("app_users").select("id, full_name").eq("id", row.user_id).single();
  const user = userRow;
  if (!user) return {
    valid: false
  };
  return {
    valid: true,
    userId: user.id,
    fullName: user.full_name
  };
});
const SignOutSchema = objectType({
  token: stringType().min(10)
});
const simpleSignOut_createServerFn_handler = createServerRpc({
  id: "49d710a1dc764df44b030b7dca0edb793cfc5b2d813132b82f01efd79893c2b6",
  name: "simpleSignOut",
  filename: "src/lib/simple-auth.functions.ts"
}, (opts) => simpleSignOut.__executeServer(opts));
const simpleSignOut = createServerFn({
  method: "POST"
}).inputValidator((d) => SignOutSchema.parse(d)).handler(simpleSignOut_createServerFn_handler, async ({
  data
}) => {
  await supabaseAdmin.from("app_sessions").delete().eq("token", data.token);
  return {
    ok: true
  };
});
export {
  simpleSignIn_createServerFn_handler,
  simpleSignOut_createServerFn_handler,
  simpleSignUp_createServerFn_handler,
  validateSession_createServerFn_handler
};
