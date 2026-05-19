import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SendSchema = z.object({
  bulkMessageId: z.string().uuid(),
});

function normalizeKePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return null;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+254" + digits.slice(1);
  if (digits.length === 9) return "+254" + digits;
  return null;
}

export const sendBulkSms = createServerFn({ method: "POST" })
  .inputValidator((d) => SendSchema.parse(d))
  .handler(async ({ data }) => {
    const AT_USERNAME = process.env.AT_USERNAME;
    const AT_API_KEY = process.env.AT_API_KEY;
    const AT_SENDER_ID = process.env.AT_SENDER_ID || "";

    const { data: bulk, error: bulkErr } = await supabaseAdmin
      .from("bulk_messages" as never)
      .select("*")
      .eq("id", data.bulkMessageId)
      .maybeSingle();
    if (bulkErr || !bulk) throw new Error("Bulk message not found");

    const b = bulk as unknown as {
      id: string;
      message: string;
      audience_ward: string | null;
      status: string;
    };

    if (b.status === "sent" || b.status === "sending") {
      throw new Error(`Already ${b.status}`);
    }

    let q = supabaseAdmin
      .from("supporters" as never)
      .select("id,name,phone,opted_out,ward")
      .eq("opted_out", false);
    if (b.audience_ward) q = q.eq("ward", b.audience_ward);
    const { data: supporters, error: sErr } = await q;
    if (sErr) throw new Error(sErr.message);

    const list = (supporters as unknown as Array<{ id: string; phone: string }>) || [];

    await supabaseAdmin
      .from("bulk_messages" as never)
      .update({ status: "sending", total_recipients: list.length } as never)
      .eq("id", b.id);

    if (list.length === 0) {
      await supabaseAdmin
        .from("bulk_messages" as never)
        .update({ status: "sent" } as never)
        .eq("id", b.id);
      return { ok: true, sent: 0, failed: 0, skipped: 0, total: 0 };
    }

    if (!AT_USERNAME || !AT_API_KEY) {
      const rows = list.map((s) => ({
        bulk_message_id: b.id,
        supporter_id: s.id,
        phone: s.phone,
        status: "skipped",
        provider_response: "AT credentials not configured",
      }));
      await supabaseAdmin.from("bulk_message_recipients" as never).insert(rows as never);
      await supabaseAdmin
        .from("bulk_messages" as never)
        .update({ status: "failed", skipped_count: list.length } as never)
        .eq("id", b.id);
      throw new Error(
        "Africa's Talking credentials are not configured. Add AT_USERNAME and AT_API_KEY secrets."
      );
    }

    const normalized = list
      .map((s) => ({ ...s, phone: normalizeKePhone(s.phone) }))
      .filter((s): s is typeof s & { phone: string } => Boolean(s.phone));

    const isSandbox = AT_USERNAME === "sandbox";
    const url = isSandbox
      ? "https://api.sandbox.africastalking.com/version1/messaging"
      : "https://api.africastalking.com/version1/messaging";

    let sent = 0;
    let failed = 0;
    const recipientRows: Array<{
      bulk_message_id: string;
      supporter_id: string;
      phone: string;
      status: string;
      provider_response: string;
    }> = [];

    for (let i = 0; i < normalized.length; i += 200) {
      const chunk = normalized.slice(i, i + 200);
      const params = new URLSearchParams({
        username: AT_USERNAME,
        to: chunk.map((c) => c.phone).join(","),
        message: b.message,
      });
      if (AT_SENDER_ID) params.set("from", AT_SENDER_ID);

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            apiKey: AT_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          body: params.toString(),
        });
        const text = await res.text();
        let json: { SMSMessageData?: { Recipients?: Array<{ number: string; status: string; statusCode: number }> } } = {};
        try {
          json = JSON.parse(text);
        } catch {
          /* keep raw */
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
            provider_response: r ? `${r.status} (${r.statusCode})` : text.slice(0, 200),
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
            provider_response: err instanceof Error ? err.message : "Network error",
          });
        }
      }
    }

    if (recipientRows.length) {
      await supabaseAdmin.from("bulk_message_recipients" as never).insert(recipientRows as never);
    }

    const skipped = list.length - normalized.length;
    await supabaseAdmin
      .from("bulk_messages" as never)
      .update({
        status: failed === normalized.length && sent === 0 ? "failed" : "sent",
        sent_count: sent,
        failed_count: failed,
        skipped_count: skipped,
      } as never)
      .eq("id", b.id);

    return { ok: true, sent, failed, skipped, total: list.length };
  });