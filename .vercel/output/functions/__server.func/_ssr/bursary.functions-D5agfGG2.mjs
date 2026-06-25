import { c as createServerRpc, s as supabaseAdmin } from "./client.server-Jc0f1I7d.mjs";
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
const Schema = objectType({
  applicationId: stringType().uuid(),
  message: stringType().min(1).max(459)
});
function normalizeKePhone(raw) {
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9) return "+254" + digits;
  return null;
}
const sendBursarySms_createServerFn_handler = createServerRpc({
  id: "27f8cd9ab7ac84567f04dc5052c10bbeacba76f5b59d1ba5c3a99c55c25f96b5",
  name: "sendBursarySms",
  filename: "src/lib/bursary.functions.ts"
}, (opts) => sendBursarySms.__executeServer(opts));
const sendBursarySms = createServerFn({
  method: "POST"
}).inputValidator((d) => Schema.parse(d)).handler(sendBursarySms_createServerFn_handler, async ({
  data
}) => {
  const {
    data: row,
    error
  } = await supabaseAdmin.from("bursary_applications").select("id,phone,guardian_phone,reference").eq("id", data.applicationId).maybeSingle();
  if (error || !row) throw new Error("Application not found");
  const r = row;
  const rawPhone = r.phone || r.guardian_phone;
  const phone = rawPhone ? normalizeKePhone(rawPhone) : null;
  if (!phone) throw new Error("No valid phone number on file");
  const AT_USERNAME = process.env.AT_USERNAME;
  const AT_API_KEY = process.env.AT_API_KEY;
  const AT_SENDER_ID = process.env.AT_SENDER_ID || "";
  const now = (/* @__PURE__ */ new Date()).toISOString();
  let providerNote = "simulated (no AT creds)";
  let simulated = true;
  if (AT_USERNAME && AT_API_KEY) {
    simulated = false;
    const isSandbox = AT_USERNAME === "sandbox";
    const url = isSandbox ? "https://api.sandbox.africastalking.com/version1/messaging" : "https://api.africastalking.com/version1/messaging";
    const params = new URLSearchParams({
      username: AT_USERNAME,
      to: phone,
      message: data.message
    });
    if (AT_SENDER_ID) params.set("from", AT_SENDER_ID);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        apiKey: AT_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json"
      },
      body: params.toString()
    });
    providerNote = (await res.text()).slice(0, 200);
  }
  await supabaseAdmin.from("bursary_applications").update({
    sms_last_sent_at: now,
    sms_last_message: data.message
  }).eq("id", r.id);
  return {
    ok: true,
    simulated,
    phone,
    reference: r.reference,
    providerNote
  };
});
export {
  sendBursarySms_createServerFn_handler
};
