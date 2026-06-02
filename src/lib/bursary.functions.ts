import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  applicationId: z.string().uuid(),
  message: z.string().min(1).max(459),
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

export const sendBursarySms = createServerFn({ method: "POST" })
  .inputValidator((d) => Schema.parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("bursary_applications" as never)
      .select("id,phone,guardian_phone,reference")
      .eq("id", data.applicationId)
      .maybeSingle();
    if (error || !row) throw new Error("Application not found");
    const r = row as unknown as {
      id: string;
      phone: string | null;
      guardian_phone: string | null;
      reference: string;
    };
    const rawPhone = r.phone || r.guardian_phone;
    const phone = rawPhone ? normalizeKePhone(rawPhone) : null;
    if (!phone) throw new Error("No valid phone number on file");

    const AT_USERNAME = process.env.AT_USERNAME;
    const AT_API_KEY = process.env.AT_API_KEY;
    const AT_SENDER_ID = process.env.AT_SENDER_ID || "";

    const now = new Date().toISOString();
    let providerNote = "simulated (no AT creds)";
    let simulated = true;

    if (AT_USERNAME && AT_API_KEY) {
      simulated = false;
      const isSandbox = AT_USERNAME === "sandbox";
      const url = isSandbox
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";
      const params = new URLSearchParams({
        username: AT_USERNAME,
        to: phone,
        message: data.message,
      });
      if (AT_SENDER_ID) params.set("from", AT_SENDER_ID);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apiKey: AT_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: params.toString(),
      });
      providerNote = (await res.text()).slice(0, 200);
    }

    await supabaseAdmin
      .from("bursary_applications" as never)
      .update({ sms_last_sent_at: now, sms_last_message: data.message } as never)
      .eq("id", r.id);

    return { ok: true, simulated, phone, reference: r.reference, providerNote };
  });
