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
const SendSchema = objectType({
  bulkMessageId: stringType().uuid()
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
const sendBulkSms_createServerFn_handler = createServerRpc({
  id: "27aeb153a917bb953e3f5a8b11c0ab7125188fc155f7e1d966f8c50023e304b5",
  name: "sendBulkSms",
  filename: "src/lib/sms.functions.ts"
}, (opts) => sendBulkSms.__executeServer(opts));
const sendBulkSms = createServerFn({
  method: "POST"
}).inputValidator((d) => SendSchema.parse(d)).handler(sendBulkSms_createServerFn_handler, async ({
  data
}) => {
  const AT_USERNAME = process.env.AT_USERNAME;
  const AT_API_KEY = process.env.AT_API_KEY;
  const AT_SENDER_ID = process.env.AT_SENDER_ID || "";
  const {
    data: bulk,
    error: bulkErr
  } = await supabaseAdmin.from("bulk_messages").select("*").eq("id", data.bulkMessageId).maybeSingle();
  if (bulkErr || !bulk) throw new Error("Bulk message not found");
  const b = bulk;
  if (b.status === "sent" || b.status === "sending") {
    throw new Error(`Already ${b.status}`);
  }
  let q = supabaseAdmin.from("supporters").select("id,name,phone,opted_out,ward").eq("opted_out", false);
  if (b.audience_ward) q = q.eq("ward", b.audience_ward);
  const {
    data: supporters,
    error: sErr
  } = await q;
  if (sErr) throw new Error(sErr.message);
  const list = supporters || [];
  await supabaseAdmin.from("bulk_messages").update({
    status: "sending",
    total_recipients: list.length
  }).eq("id", b.id);
  if (list.length === 0) {
    await supabaseAdmin.from("bulk_messages").update({
      status: "sent"
    }).eq("id", b.id);
    return {
      ok: true,
      sent: 0,
      failed: 0,
      skipped: 0,
      total: 0
    };
  }
  if (!AT_USERNAME || !AT_API_KEY) {
    const rows = list.map((s) => ({
      bulk_message_id: b.id,
      supporter_id: s.id,
      phone: s.phone,
      status: "skipped",
      provider_response: "AT credentials not configured"
    }));
    await supabaseAdmin.from("bulk_message_recipients").insert(rows);
    await supabaseAdmin.from("bulk_messages").update({
      status: "failed",
      skipped_count: list.length
    }).eq("id", b.id);
    throw new Error("Africa's Talking credentials are not configured. Add AT_USERNAME and AT_API_KEY secrets.");
  }
  const normalized = list.map((s) => ({
    ...s,
    phone: normalizeKePhone(s.phone)
  })).filter((s) => Boolean(s.phone));
  const isSandbox = AT_USERNAME === "sandbox";
  const url = isSandbox ? "https://api.sandbox.africastalking.com/version1/messaging" : "https://api.africastalking.com/version1/messaging";
  let sent = 0;
  let failed = 0;
  const recipientRows = [];
  for (let i = 0; i < normalized.length; i += 200) {
    const chunk = normalized.slice(i, i + 200);
    const params = new URLSearchParams({
      username: AT_USERNAME,
      to: chunk.map((c) => c.phone).join(","),
      message: b.message
    });
    if (AT_SENDER_ID) params.set("from", AT_SENDER_ID);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json"
        },
        body: params.toString()
      });
      const text = await res.text();
      let json = {};
      try {
        json = JSON.parse(text);
      } catch {
      }
      const recips = json?.SMSMessageData?.Recipients ?? [];
      const byPhone = new Map(recips.map((r) => [r.number, r]));
      for (const c of chunk) {
        const r = byPhone.get(c.phone);
        const success = r && (r.status === "Success" || r.statusCode === 101 || r.statusCode === 102);
        if (success) sent++;
        else failed++;
        recipientRows.push({
          bulk_message_id: b.id,
          supporter_id: c.id,
          phone: c.phone,
          status: success ? "sent" : "failed",
          provider_response: r ? `${r.status} (${r.statusCode})` : text.slice(0, 200)
        });
      }
    } catch (err) {
      for (const c of chunk) {
        failed++;
        recipientRows.push({
          bulk_message_id: b.id,
          supporter_id: c.id,
          phone: c.phone,
          status: "failed",
          provider_response: err instanceof Error ? err.message : "Network error"
        });
      }
    }
  }
  if (recipientRows.length) {
    await supabaseAdmin.from("bulk_message_recipients").insert(recipientRows);
  }
  const skipped = list.length - normalized.length;
  await supabaseAdmin.from("bulk_messages").update({
    status: failed === normalized.length && sent === 0 ? "failed" : "sent",
    sent_count: sent,
    failed_count: failed,
    skipped_count: skipped
  }).eq("id", b.id);
  return {
    ok: true,
    sent,
    failed,
    skipped,
    total: list.length
  };
});
export {
  sendBulkSms_createServerFn_handler
};
